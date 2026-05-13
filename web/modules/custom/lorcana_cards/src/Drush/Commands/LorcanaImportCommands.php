<?php

declare(strict_types=1);

namespace Drupal\lorcana_cards\Drush\Commands;

use Drupal\lorcana_cards\Importer\CardDataImporterInterface;
use Drupal\lorcana_cards\Importer\CardDataImporterManager;
use Drupal\lorcana_cards\Importer\CardUpserter;
use Drush\Attributes as CLI;
use Drush\Commands\AutowireTrait;
use Drush\Commands\DrushCommands;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

final class LorcanaImportCommands extends DrushCommands {

  use AutowireTrait;

  public function __construct(
    #[Autowire(service: 'plugin.manager.lorcana_cards.card_data_importer')]
    private readonly CardDataImporterManager $dataManager,
    #[Autowire(service: 'lorcana_cards.upserter')]
    private readonly CardUpserter $upserter,
  ) {
    parent::__construct();
  }

  #[CLI\Command(name: 'lorcana:import:sets', aliases: ['lci-sets'])]
  #[CLI\Help(description: 'Refresh the list of Lorcana sets from a data importer plugin.')]
  #[CLI\Option(name: 'source', description: 'Data importer plugin id')]
  public function importSets(array $options = ['source' => 'lorcast']): int {
    $plugin = $this->loadPlugin((string) $options['source']);
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
  #[CLI\Option(name: 'limit', description: 'Cap on cards to upsert (for smoke tests)')]
  public function importCards(array $options = [
    'set' => NULL,
    'lang' => 'en',
    'source' => 'lorcast',
    'limit' => 0,
  ]): int {
    if (empty($options['set'])) {
      $this->io()->error('--set is required (e.g., --set=1).');
      return self::EXIT_FAILURE;
    }
    $plugin = $this->loadPlugin((string) $options['source']);
    $this->upserter->resetStats();
    $limit = (int) ($options['limit'] ?? 0);
    $count = 0;
    foreach ($plugin->fetchCardsForSet((string) $options['set'], (string) $options['lang']) as $card) {
      $this->upserter->upsertCard($card);
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
  public function importAll(array $options = ['langs' => 'en', 'source' => 'lorcast']): int {
    $plugin = $this->loadPlugin((string) $options['source']);
    $langs = array_filter(array_map('trim', explode(',', (string) $options['langs'])));
    $this->upserter->resetStats();
    foreach ($plugin->listSets() as $set) {
      $this->upserter->upsertSet($set);
      foreach ($langs as $lang) {
        foreach ($plugin->fetchCardsForSet($set->code, $lang) as $card) {
          $this->upserter->upsertCard($card);
        }
      }
    }
    $this->io()->success($this->summarize());
    return self::EXIT_SUCCESS;
  }

  private function loadPlugin(string $id): CardDataImporterInterface {
    /** @var \Drupal\lorcana_cards\Importer\CardDataImporterInterface $plugin */
    $plugin = $this->dataManager->createInstance($id);
    return $plugin;
  }

  private function summarize(): string {
    $stats = $this->upserter->getStats();
    return sprintf(
      'sets +%d ~%d · cards +%d ~%d · failed %d',
      $stats['sets_created'],
      $stats['sets_updated'],
      $stats['cards_created'],
      $stats['cards_updated'],
      $stats['cards_failed'],
    );
  }

}
