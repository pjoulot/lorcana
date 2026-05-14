<?php

declare(strict_types=1);

namespace Drupal\lorcana_cards\Drush\Commands;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\lorcana_cards\Importer\CardDataImporterInterface;
use Drupal\lorcana_cards\Importer\CardDataImporterManager;
use Drupal\lorcana_cards\Importer\CardImageImporterInterface;
use Drupal\lorcana_cards\Importer\CardImageImporterManager;
use Drupal\lorcana_cards\Importer\CardUpserter;
use Drupal\taxonomy\Entity\Term;
use Drush\Attributes as CLI;
use Drush\Commands\AutowireTrait;
use Drush\Commands\DrushCommands;
use GuzzleHttp\ClientInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

final class LorcanaImportCommands extends DrushCommands {

  use AutowireTrait;

  private const LORCANA_API_BULK_URL = 'https://api.lorcana-api.com/bulk/cards';

  public function __construct(
    #[Autowire(service: 'plugin.manager.lorcana_cards.card_data_importer')]
    private readonly CardDataImporterManager $dataManager,
    #[Autowire(service: 'plugin.manager.lorcana_cards.card_image_importer')]
    private readonly CardImageImporterManager $imageManager,
    #[Autowire(service: 'lorcana_cards.upserter')]
    private readonly CardUpserter $upserter,
    #[Autowire(service: 'entity_type.manager')]
    private readonly EntityTypeManagerInterface $entityTypeManager,
    #[Autowire(service: 'http_client')]
    private readonly ClientInterface $httpClient,
  ) {
    parent::__construct();
  }

  #[CLI\Command(name: 'lorcana:import:sets', aliases: ['lci-sets'])]
  #[CLI\Help(description: 'Refresh the list of Lorcana sets from a data importer plugin.')]
  #[CLI\Option(name: 'source', description: 'Data importer plugin id')]
  public function importSets(array $options = ['source' => 'lorcast']): int {
    $plugin = $this->loadDataPlugin((string) $options['source']);
    $this->upserter->resetStats();
    foreach ($plugin->listSets() as $set) {
      $this->upserter->upsertSet($set);
      $this->io()->writeln(sprintf('  %s — %s', $set->code, $set->name));
    }
    $this->io()->success($this->summarize());
    return self::EXIT_SUCCESS;
  }

  #[CLI\Command(name: 'lorcana:import:cards', aliases: ['lci-cards'])]
  #[CLI\Help(description: 'Import cards from one set in one language.')]
  #[CLI\Option(name: 'set', description: 'Set code (e.g., 1, 2, P1)')]
  #[CLI\Option(name: 'lang', description: 'Langcode (en, fr, de, it)')]
  #[CLI\Option(name: 'source', description: 'Data importer plugin id')]
  #[CLI\Option(name: 'image-source', description: 'Image importer plugin id')]
  #[CLI\Option(name: 'skip-images', description: 'Import card data but not images')]
  #[CLI\Option(name: 'limit', description: 'Cap on cards to upsert (for smoke tests)')]
  public function importCards(array $options = [
    'set' => NULL,
    'lang' => 'en',
    'source' => 'lorcast',
    'image-source' => 'lorcast',
    'skip-images' => FALSE,
    'limit' => 0,
  ]): int {
    if (empty($options['set'])) {
      $this->io()->error('--set is required (e.g., --set=1).');
      return self::EXIT_FAILURE;
    }
    $plugin = $this->loadDataPlugin((string) $options['source']);
    $imagePlugin = $options['skip-images'] ? NULL : $this->loadImagePlugin((string) $options['image-source']);
    $this->upserter->resetStats();
    $limit = (int) ($options['limit'] ?? 0);
    $count = 0;
    foreach ($plugin->fetchCardsForSet((string) $options['set'], (string) $options['lang']) as $card) {
      $this->upserter->upsertCard($card, $imagePlugin);
      $count++;
      if ($limit > 0 && $count >= $limit) {
        break;
      }
    }
    $this->io()->success($this->summarize());
    return self::EXIT_SUCCESS;
  }

  #[CLI\Command(name: 'lorcana:import:all', aliases: ['lci-all'])]
  #[CLI\Help(description: 'Import every set then every card in the configured languages.')]
  #[CLI\Option(name: 'langs', description: 'Comma-separated langcodes')]
  #[CLI\Option(name: 'source', description: 'Data importer plugin id')]
  #[CLI\Option(name: 'image-source', description: 'Image importer plugin id')]
  #[CLI\Option(name: 'skip-images', description: 'Import card data but not images')]
  public function importAll(array $options = [
    'langs' => 'en',
    'source' => 'lorcast',
    'image-source' => 'lorcast',
    'skip-images' => FALSE,
  ]): int {
    $plugin = $this->loadDataPlugin((string) $options['source']);
    $imagePlugin = $options['skip-images'] ? NULL : $this->loadImagePlugin((string) $options['image-source']);
    $langs = array_filter(array_map('trim', explode(',', (string) $options['langs'])));
    $this->upserter->resetStats();
    foreach ($plugin->listSets() as $set) {
      $this->upserter->upsertSet($set);
      foreach ($langs as $lang) {
        foreach ($plugin->fetchCardsForSet($set->code, $lang) as $card) {
          $this->upserter->upsertCard($card, $imagePlugin);
        }
      }
    }
    $this->io()->success($this->summarize());
    return self::EXIT_SUCCESS;
  }

  #[CLI\Command(name: 'lorcana:import:franchises', aliases: ['lci-fr'])]
  #[CLI\Help(description: 'Populate field_franchise on existing card nodes from lorcana-api.com. Lorcast does not carry franchise data; this command is the gap-filler.')]
  #[CLI\Option(name: 'force', description: 'Overwrite even cards that already have a franchise set')]
  public function importFranchises(array $options = ['force' => FALSE]): int {
    $this->io()->writeln('Fetching lorcana-api.com bulk card data...');
    $response = $this->httpClient->request('GET', self::LORCANA_API_BULK_URL, ['timeout' => 60]);
    $rows = json_decode((string) $response->getBody(), TRUE);
    if (!is_array($rows)) {
      $this->io()->error('Bulk endpoint did not return JSON array.');
      return self::EXIT_FAILURE;
    }
    $this->io()->writeln(sprintf('Fetched %d rows; building franchise map.', count($rows)));

    // Key: "<set_code>:<card_num>". lorcana-api uses int Set_Num + int Card_Num
    // — coerce to strings to match our string-typed fields.
    $map = [];
    foreach ($rows as $row) {
      if (empty($row['Franchise']) || empty($row['Set_Num']) || empty($row['Card_Num'])) {
        continue;
      }
      $key = (string) $row['Set_Num'] . ':' . (string) $row['Card_Num'];
      $map[$key] = (string) $row['Franchise'];
    }
    $this->io()->writeln(sprintf('Indexed %d (set, card) → franchise mappings.', count($map)));

    $nodeStorage = $this->entityTypeManager->getStorage('node');
    $termStorage = $this->entityTypeManager->getStorage('taxonomy_term');
    $franchiseTermCache = [];

    $cardIds = $nodeStorage->getQuery()
      ->accessCheck(FALSE)
      ->condition('type', 'card')
      ->execute();

    $matched = 0;
    $skipped = 0;
    $unmatched = 0;
    foreach ($nodeStorage->loadMultiple($cardIds) as $card) {
      if (!$options['force'] && !$card->get('field_franchise')->isEmpty()) {
        $skipped++;
        continue;
      }
      $set = $card->get('field_set')->entity;
      if (!$set) {
        $unmatched++;
        continue;
      }
      $key = $set->get('field_set_code')->value . ':' . $card->get('field_collector_number')->value;
      if (!isset($map[$key])) {
        $unmatched++;
        continue;
      }
      $label = $map[$key];
      if (!isset($franchiseTermCache[$label])) {
        $existing = $termStorage->loadByProperties(['vid' => 'franchise', 'name' => $label]);
        if ($existing) {
          $franchiseTermCache[$label] = reset($existing);
        }
        else {
          $term = Term::create(['vid' => 'franchise', 'name' => $label, 'langcode' => 'en']);
          $term->save();
          $franchiseTermCache[$label] = $term;
        }
      }
      $card->set('field_franchise', ['target_id' => $franchiseTermCache[$label]->id()]);
      $card->save();
      $matched++;
    }

    $this->io()->success(sprintf('matched %d · skipped %d (already set) · unmatched %d', $matched, $skipped, $unmatched));
    return self::EXIT_SUCCESS;
  }

  private function loadDataPlugin(string $id): CardDataImporterInterface {
    /** @var \Drupal\lorcana_cards\Importer\CardDataImporterInterface $plugin */
    $plugin = $this->dataManager->createInstance($id);
    return $plugin;
  }

  private function loadImagePlugin(string $id): CardImageImporterInterface {
    /** @var \Drupal\lorcana_cards\Importer\CardImageImporterInterface $plugin */
    $plugin = $this->imageManager->createInstance($id);
    return $plugin;
  }

  private function summarize(): string {
    $stats = $this->upserter->getStats();
    return sprintf(
      'sets +%d ~%d · cards +%d ~%d · failed %d · images +%d failed %d',
      $stats['sets_created'],
      $stats['sets_updated'],
      $stats['cards_created'],
      $stats['cards_updated'],
      $stats['cards_failed'],
      $stats['images_attached'],
      $stats['images_failed'],
    );
  }

}
