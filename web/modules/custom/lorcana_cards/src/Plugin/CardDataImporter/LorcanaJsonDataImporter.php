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

/**
 * Imports card data from lorcanaJSON.org.
 *
 * lorcanaJSON aggregates the official Disney Lorcana app data and serves one
 * file per language at /files/current/{lang}/allCards.json — covering every
 * set, with genuine localized text and official Ravensburger image URLs. It is
 * the project's primary source: unlike Lorcast it carries non-English data,
 * dual-ink (`colors`), the Epic/Iconic rarities, and structured abilities. It
 * does NOT carry market prices (see supportsPriceRefresh).
 *
 * Game-mechanic enums (type, rarity, ink) arrive localized; we normalise them
 * to our machine values with the static maps below. The open vocabularies
 * (classifications, keyword abilities) also arrive localized — for non-English
 * imports they are canonicalised to their English term in a later phase (see
 * canonicalizeLabels); English labels are already canonical.
 */
#[CardDataImporter(
  id: 'lorcana_json',
  label: 'lorcanaJSON',
  supports_languages: ['en', 'fr'],
  homepage: 'https://lorcanajson.org',
)]
final class LorcanaJsonDataImporter extends PluginBase implements CardDataImporterInterface, ContainerFactoryPluginInterface {

  use StringTranslationTrait;

  private const BASE_URL = 'https://lorcanajson.org/files/current';

  /**
   * Localized card `type` → our field_card_types machine name.
   */
  private const TYPE_MAP = [
    'character' => 'character', 'personnage' => 'character',
    'action' => 'action',
    'item' => 'item', 'objet' => 'item',
    'location' => 'location', 'lieu' => 'location',
    'song' => 'song', 'chanson' => 'song',
  ];

  /**
   * Localized `rarity` → our field_rarity machine value.
   */
  private const RARITY_MAP = [
    'common' => 'common', 'commune' => 'common',
    'uncommon' => 'uncommon', 'inhabituelle' => 'uncommon',
    'rare' => 'rare',
    'super rare' => 'super_rare', 'très rare' => 'super_rare', 'tres rare' => 'super_rare',
    'legendary' => 'legendary', 'légendaire' => 'legendary', 'legendaire' => 'legendary',
    'enchanted' => 'enchanted', 'enchantée' => 'enchanted', 'enchantee' => 'enchanted',
    'epic' => 'epic', 'épique' => 'epic', 'epique' => 'epic',
    'iconic' => 'iconic', 'iconique' => 'iconic',
    'special' => 'special', 'spécial' => 'special', 'speciale' => 'special',
    'promo' => 'promo',
  ];

  /**
   * Localized `colors` entry → canonical English ink_color term name.
   */
  private const INK_MAP = [
    'amber' => 'Amber', 'ambre' => 'Amber',
    'amethyst' => 'Amethyst', 'améthyste' => 'Amethyst', 'amethyste' => 'Amethyst',
    'emerald' => 'Emerald', 'émeraude' => 'Emerald', 'emeraude' => 'Emerald',
    'ruby' => 'Ruby', 'rubis' => 'Ruby',
    'sapphire' => 'Sapphire', 'saphir' => 'Sapphire',
    'steel' => 'Steel', 'acier' => 'Steel',
  ];

  /**
   * Localized subtype labels that denote the Song card type, not a class.
   */
  private const SONG_SUBTYPES = ['song', 'chanson'];

  /**
   * Decoded datasets keyed by langcode: ['cards' => …, 'sets' => …].
   *
   * @var array<string,array{cards:array<string,list<array<string,mixed>>>,sets:array<string,array<string,mixed>>}>
   */
  private array $datasets = [];

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
    $sets = [];
    foreach ($this->dataset('en')['sets'] as $code => $row) {
      $sets[] = new SetSummary(
        sourceId: (string) $code,
        code: (string) $code,
        name: (string) ($row['name'] ?? $code),
        releasedAt: $row['releaseDate'] ?? NULL,
        prereleasedAt: $row['prereleaseDate'] ?? NULL,
      );
    }
    return $sets;
  }

  public function fetchCardsForSet(string $setCode, string $langcode): \Generator {
    $dataset = $this->dataset($langcode);
    foreach ($dataset['cards'][$setCode] ?? [] as $row) {
      yield $this->mapToCardData($row, $langcode, $dataset['sets']);
    }
  }

  public function supportsPriceRefresh(): bool {
    // lorcanaJSON carries marketplace links but no price values; prices are a
    // separate (M9) concern handled by a price-only refresh source.
    return FALSE;
  }

  public function fetchPricesForSet(string $setCode): \Generator {
    yield from [];
  }

  /**
   * Downloads + indexes one language's dataset, memoised per plugin instance.
   *
   * @return array{cards:array<string,list<array<string,mixed>>>,sets:array<string,array<string,mixed>>}
   */
  private function dataset(string $langcode): array {
    if (isset($this->datasets[$langcode])) {
      return $this->datasets[$langcode];
    }
    $url = self::BASE_URL . '/' . $langcode . '/allCards.json';
    try {
      $response = $this->httpClient->request('GET', $url, [
        'headers' => ['Accept' => 'application/json'],
        'timeout' => 60,
      ]);
      $decoded = json_decode((string) $response->getBody(), TRUE);
    }
    catch (\Throwable $e) {
      throw new PluginException(sprintf('Failed to fetch lorcanaJSON dataset for "%s": %s', $langcode, $e->getMessage()), 0, $e);
    }
    if (!is_array($decoded) || !isset($decoded['cards'])) {
      throw new PluginException(sprintf('Unexpected lorcanaJSON payload for "%s".', $langcode));
    }

    $bySet = [];
    foreach ($decoded['cards'] as $card) {
      $bySet[(string) ($card['setCode'] ?? '')][] = $card;
    }
    return $this->datasets[$langcode] = [
      'cards' => $bySet,
      'sets' => $decoded['sets'] ?? [],
    ];
  }

  /**
   * @param array<string,mixed> $row
   * @param array<string,array<string,mixed>> $sets
   */
  private function mapToCardData(array $row, string $langcode, array $sets): CardData {
    $setCode = (string) ($row['setCode'] ?? '');
    $type = $this->normalize(self::TYPE_MAP, (string) ($row['type'] ?? ''), 'character');

    $subtypes = array_values(array_filter(
      $row['subtypes'] ?? [],
      static fn($s) => !in_array(mb_strtolower((string) $s), self::SONG_SUBTYPES, TRUE),
    ));
    $isSong = count($subtypes) !== count($row['subtypes'] ?? []);
    $cardTypes = $isSong ? [$type, 'song'] : [$type];

    $inks = [];
    foreach ($this->extractColors($row) as $color) {
      $ink = $this->normalize(self::INK_MAP, $color, '');
      if ($ink !== '') {
        $inks[] = $ink;
      }
    }

    $keywords = [];
    foreach ($row['abilities'] ?? [] as $ability) {
      if (($ability['type'] ?? '') === 'keyword' && !empty($ability['keyword'])) {
        $keywords[] = (string) $ability['keyword'];
      }
    }

    return new CardData(
      sourceId: 'lorcana_json',
      language: $langcode,
      // lorcanaJSON's `id` is shared across languages, so it can't be the
      // per-node key on its own — qualify it with the langcode.
      lorcastId: ((string) ($row['id'] ?? '')) . '-' . $langcode,
      setCode: $setCode,
      collectorNumber: $this->buildCollectorNumber($row),
      name: (string) ($row['name'] ?? ''),
      version: $row['version'] ?? NULL,
      layout: $type === 'location' ? 'landscape' : 'normal',
      cost: (int) ($row['cost'] ?? 0),
      inkable: (bool) ($row['inkwell'] ?? FALSE),
      inks: $inks,
      cardTypes: $cardTypes,
      classifications: $this->canonicalizeLabels($subtypes, $langcode),
      strength: isset($row['strength']) ? (int) $row['strength'] : NULL,
      willpower: isset($row['willpower']) ? (int) $row['willpower'] : NULL,
      lore: isset($row['lore']) ? (int) $row['lore'] : NULL,
      moveCost: isset($row['moveCost']) ? (int) $row['moveCost'] : NULL,
      text: $row['fullText'] ?? NULL,
      flavorText: $row['flavorText'] ?? NULL,
      keywords: $this->canonicalizeLabels($keywords, $langcode),
      rarity: $this->normalize(self::RARITY_MAP, (string) ($row['rarity'] ?? ''), 'common'),
      illustrators: $row['artists'] ?? [],
      imageUris: $this->extractImageUris($row),
      tcgplayerId: isset($row['externalLinks']['tcgPlayerId']) ? (int) $row['externalLinks']['tcgPlayerId'] : NULL,
      legalCore: !empty($row['allowedInFormats']['Core']['allowed']) ? 'legal' : 'not_legal',
      priceUsd: NULL,
      priceUsdFoil: NULL,
      releasedAt: $sets[$setCode]['releaseDate'] ?? NULL,
      // Variant printings link to their base via baseId; a base card groups
      // under its own id. Consistent within and across languages.
      printingGroupId: (string) ($row['baseId'] ?? $row['id'] ?? ''),
      sourceFields: $row,
    );
  }

  /**
   * Extracts the card's ink colour labels.
   *
   * lorcanaJSON carries ink in `colors` (array, present only on dual-ink
   * cards) and `color` (string, on every card — "Amber-Steel" for dual). Ink
   * names contain no hyphen, so splitting `color` on "-" covers mono- and
   * dual-ink uniformly; we prefer the explicit array when present.
   *
   * @param array<string,mixed> $row
   * @return string[]
   */
  private function extractColors(array $row): array {
    if (!empty($row['colors']) && is_array($row['colors'])) {
      return array_map('strval', $row['colors']);
    }
    return array_values(array_filter(array_map('trim', explode('-', (string) ($row['color'] ?? '')))));
  }

  /**
   * Builds a collector number unique within a (set, language).
   *
   * The base `number` is shared across art variants (Dalmatian Puppy a–e) and
   * promo series that lorcanaJSON folds under the parent set, so we qualify it
   * with the variant letter and promo group. The lone remaining ambiguity —
   * one card slot printed under two regional names (Moana / Vaiana, P2 #26) —
   * collapses to a single node, which is faithful to our (set, collector
   * number) identity model.
   *
   * @param array<string,mixed> $row
   */
  private function buildCollectorNumber(array $row): string {
    $base = (string) ($row['number'] ?? '') . mb_strtolower((string) ($row['variant'] ?? ''));
    $promo = $row['promoGrouping'] ?? NULL;
    return $promo ? $promo . '-' . $base : $base;
  }

  /**
   * Maps a localized enum value to its machine value via a static map.
   *
   * @param array<string,string> $map
   */
  private function normalize(array $map, string $value, string $default): string {
    return $map[mb_strtolower(trim($value))] ?? $default;
  }

  /**
   * Canonicalises localized open-vocabulary labels to their English term.
   *
   * English is already canonical. Non-English imports resolve labels to their
   * English equivalent so every language references one shared taxonomy term;
   * that mapping is wired in the French phase. Until then non-English labels
   * pass through unchanged.
   *
   * @param string[] $labels
   * @return string[]
   */
  private function canonicalizeLabels(array $labels, string $langcode): array {
    return $labels;
  }

  /**
   * @param array<string,mixed> $row
   * @return array<string,string>
   */
  private function extractImageUris(array $row): array {
    $images = $row['images'] ?? [];
    $full = $images['full'] ?? NULL;
    $thumb = $images['thumbnail'] ?? NULL;
    $uris = [];
    if ($full) {
      $uris['large'] = (string) $full;
      $uris['normal'] = (string) $full;
    }
    if ($thumb) {
      $uris['small'] = (string) $thumb;
    }
    return $uris;
  }

}
