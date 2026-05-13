<?php

declare(strict_types=1);

namespace Drupal\lorcana_cards\Plugin\CardDataImporter;

use Drupal\Component\Plugin\Exception\PluginException;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\Core\Plugin\PluginBase;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\lorcana_cards\Attribute\CardDataImporter;
use Drupal\lorcana_cards\Importer\CardData;
use Drupal\lorcana_cards\Importer\CardDataImporterInterface;
use Drupal\lorcana_cards\Importer\SetSummary;
use GuzzleHttp\ClientInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

#[CardDataImporter(
  id: 'lorcast',
  label: 'Lorcast',
  supports_languages: ['en', 'fr', 'de', 'it'],
  homepage: 'https://lorcast.com',
)]
final class LorcastDataImporter extends PluginBase implements CardDataImporterInterface, ContainerFactoryPluginInterface {

  use StringTranslationTrait;

  private const BASE_URL = 'https://api.lorcast.com/v0';
  private const RATE_LIMIT_MICROSECONDS = 100_000;

  public function __construct(
    array $configuration,
    string $plugin_id,
    mixed $plugin_definition,
    private readonly ClientInterface $httpClient,
  ) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
  }

  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition): self {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('http_client'),
    );
  }

  public function getId(): string {
    return $this->pluginId;
  }

  public function getLabel(): string {
    return (string) $this->pluginDefinition['label'];
  }

  public function supportedLanguages(): array {
    return $this->pluginDefinition['supports_languages'] ?? ['en'];
  }

  public function listSets(): array {
    $body = $this->get('/sets');
    $sets = [];
    foreach ($body['results'] ?? [] as $row) {
      $sets[] = new SetSummary(
        sourceId: $row['id'],
        code: (string) $row['code'],
        name: $row['name'],
        releasedAt: $row['released_at'] ?? NULL,
        prereleasedAt: $row['prereleased_at'] ?? NULL,
      );
    }
    return $sets;
  }

  public function fetchCardsForSet(string $setCode, string $langcode): \Generator {
    // Lorcast addresses sets by id (set_xxx), not code, so we resolve first.
    $setId = $this->resolveSetId($setCode);
    if ($setId === NULL) {
      throw new PluginException(sprintf('Unknown set code "%s" on Lorcast.', $setCode));
    }

    if ($langcode === 'en') {
      $rows = $this->get('/sets/' . $setId . '/cards');
    }
    else {
      // Per spec 3, non-EN support uses the `lang:` filter on /cards/search.
      // Verification deferred until first non-EN import attempt.
      $rows = $this->get('/cards/search', ['q' => 'set:' . $setCode . ' lang:' . $langcode]);
      $rows = $rows['results'] ?? [];
    }

    foreach ($rows as $row) {
      yield $this->mapToCardData($row, $langcode);
    }
  }

  public function supportsPriceRefresh(): bool {
    return TRUE;
  }

  public function fetchPricesForSet(string $setCode): \Generator {
    foreach ($this->fetchCardsForSet($setCode, 'en') as $card) {
      yield [
        'lorcast_id' => $card->lorcastId,
        'price_usd' => $card->priceUsd,
        'price_usd_foil' => $card->priceUsdFoil,
      ];
    }
  }

  private function resolveSetId(string $setCode): ?string {
    foreach ($this->listSets() as $set) {
      if ($set->code === $setCode) {
        return $set->sourceId;
      }
    }
    return NULL;
  }

  /**
   * @param array<string,mixed> $row
   */
  private function mapToCardData(array $row, string $langcode): CardData {
    $types = array_map(static fn($t) => strtolower((string) $t), $row['type'] ?? []);
    $rarity = strtolower((string) ($row['rarity'] ?? 'common'));
    $printingGroupId = $this->buildPrintingGroupId((string) ($row['set']['code'] ?? ''), (string) $row['name'], $row['version'] ?? NULL);

    return new CardData(
      sourceId: 'lorcast',
      language: $langcode,
      lorcastId: (string) $row['id'],
      setCode: (string) ($row['set']['code'] ?? ''),
      collectorNumber: (string) ($row['collector_number'] ?? ''),
      name: (string) $row['name'],
      version: $row['version'] ?? NULL,
      layout: (string) ($row['layout'] ?? 'normal'),
      cost: (int) ($row['cost'] ?? 0),
      inkable: (bool) ($row['inkwell'] ?? FALSE),
      ink: $row['ink'] ?? NULL,
      cardTypes: $types,
      classifications: $row['classifications'] ?? [],
      strength: isset($row['strength']) ? (int) $row['strength'] : NULL,
      willpower: isset($row['willpower']) ? (int) $row['willpower'] : NULL,
      lore: isset($row['lore']) ? (int) $row['lore'] : NULL,
      moveCost: isset($row['move_cost']) ? (int) $row['move_cost'] : NULL,
      text: $row['text'] ?? NULL,
      flavorText: $row['flavor_text'] ?? NULL,
      keywords: $row['keywords'] ?? [],
      rarity: $rarity,
      illustrators: $row['illustrators'] ?? [],
      imageUris: $row['image_uris']['digital'] ?? [],
      tcgplayerId: isset($row['tcgplayer_id']) ? (int) $row['tcgplayer_id'] : NULL,
      legalCore: (string) ($row['legalities']['core'] ?? 'legal'),
      priceUsd: $row['prices']['usd'] ?? NULL,
      priceUsdFoil: $row['prices']['usd_foil'] ?? NULL,
      releasedAt: $row['released_at'] ?? NULL,
      printingGroupId: $printingGroupId,
      sourceFields: $row,
    );
  }

  private function buildPrintingGroupId(string $setCode, string $name, ?string $version): string {
    $slugSource = strtolower($setCode . '-' . $name . '-' . ($version ?? ''));
    $slug = preg_replace('/[^a-z0-9]+/', '-', $slugSource) ?? '';
    return trim($slug, '-');
  }

  /**
   * @param array<string,string|int> $query
   * @return array<mixed>
   */
  private function get(string $path, array $query = []): array {
    usleep(self::RATE_LIMIT_MICROSECONDS);
    $response = $this->httpClient->request('GET', self::BASE_URL . $path, [
      'query' => $query,
      'headers' => ['Accept' => 'application/json'],
      'timeout' => 30,
    ]);
    $decoded = json_decode((string) $response->getBody(), TRUE);
    return is_array($decoded) ? $decoded : [];
  }

}
