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
 * LorcanaJSON aggregates the official Disney Lorcana app data and serves one
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
    'character' => 'character',
    'personnage' => 'character',
    'action' => 'action',
    'item' => 'item',
    'objet' => 'item',
    'location' => 'location',
    'lieu' => 'location',
    'song' => 'song',
    'chanson' => 'song',
  ];

  /**
   * Localized `rarity` → our field_rarity machine value.
   */
  private const RARITY_MAP = [
    'common' => 'common',
    'commune' => 'common',
    'uncommon' => 'uncommon',
    'inhabituelle' => 'uncommon',
    'rare' => 'rare',
    'super rare' => 'super_rare',
    'très rare' => 'super_rare',
    'tres rare' => 'super_rare',
    'legendary' => 'legendary',
    'légendaire' => 'legendary',
    'legendaire' => 'legendary',
    'enchanted' => 'enchanted',
    'enchantée' => 'enchanted',
    'enchantee' => 'enchanted',
    'epic' => 'epic',
    'épique' => 'epic',
    'epique' => 'epic',
    'iconic' => 'iconic',
    'iconique' => 'iconic',
    'special' => 'special',
    'spécial' => 'special',
    'speciale' => 'special',
    'promo' => 'promo',
  ];

  /**
   * Localized `colors` entry → canonical English ink_color term name.
   */
  private const INK_MAP = [
    'amber' => 'Amber',
    'ambre' => 'Amber',
    'amethyst' => 'Amethyst',
    'améthyste' => 'Amethyst',
    'amethyste' => 'Amethyst',
    'emerald' => 'Emerald',
    'émeraude' => 'Emerald',
    'emeraude' => 'Emerald',
    'ruby' => 'Ruby',
    'rubis' => 'Ruby',
    'sapphire' => 'Sapphire',
    'saphir' => 'Sapphire',
    'steel' => 'Steel',
    'acier' => 'Steel',
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

  /**
   * Localized-label → English-label maps, keyed by langcode (see labelMap()).
   *
   * @var array<string,array<string,string>>
   */
  private array $labelMaps = [];

  public function __construct(
    array $configuration,
    string $plugin_id,
    mixed $plugin_definition,
    private readonly ClientInterface $httpClient,
  ) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition): self {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('http_client'),
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getId(): string {
    return $this->pluginId;
  }

  /**
   * {@inheritdoc}
   */
  public function getLabel(): string {
    return (string) $this->pluginDefinition['label'];
  }

  /**
   * {@inheritdoc}
   */
  public function supportedLanguages(): array {
    return $this->pluginDefinition['supports_languages'] ?? ['en'];
  }

  /**
   * {@inheritdoc}
   */
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

  /**
   * {@inheritdoc}
   */
  public function fetchCardsForSet(string $setCode, string $langcode): \Generator {
    $dataset = $this->dataset($langcode);
    foreach ($dataset['cards'][$setCode] ?? [] as $row) {
      yield $this->mapToCardData($row, $langcode, $dataset['sets']);
    }
  }

  /**
   * {@inheritdoc}
   */
  public function supportsPriceRefresh(): bool {
    // lorcanaJSON carries marketplace links but no price values; prices are a
    // separate (M9) concern handled by a price-only refresh source.
    return FALSE;
  }

  /**
   * {@inheritdoc}
   */
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
      classifications: $this->canonicalizeLabels(array_map('strval', $subtypes), $langcode),
      strength: isset($row['strength']) ? (int) $row['strength'] : NULL,
      willpower: isset($row['willpower']) ? (int) $row['willpower'] : NULL,
      lore: isset($row['lore']) ? (int) $row['lore'] : NULL,
      moveCost: isset($row['moveCost']) ? (int) $row['moveCost'] : NULL,
      text: $row['fullText'] ?? NULL,
      flavorText: $row['flavorText'] ?? NULL,
      keywords: $this->canonicalizeLabels($this->keywordNames($row), $langcode),
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
   * LorcanaJSON carries ink in `colors` (array, present only on dual-ink
   * cards) and `color` (string, on every card — "Amber-Steel" for dual). Ink
   * names contain no hyphen, so splitting `color` on "-" covers mono- and
   * dual-ink uniformly; we prefer the explicit array when present.
   *
   * @param array<string,mixed> $row
   *
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
   * Classifications (subtypes) and keyword abilities arrive localized. So
   * every language's cards reference one shared taxonomy term, non-English
   * labels are resolved to their English equivalent via a map learned by
   * zipping this language's dataset against the English one (same card by id,
   * same position in each list). English is already canonical; unmapped labels
   * (e.g. Storyborn, which lorcanaJSON leaves untranslated) pass through.
   *
   * @param string[] $labels
   *
   * @return string[]
   */
  private function canonicalizeLabels(array $labels, string $langcode): array {
    if ($langcode === 'en' || $labels === []) {
      return $labels;
    }
    $map = $this->labelMap($langcode);
    return array_map(static fn(string $l) => $map[mb_strtolower($l)] ?? $l, $labels);
  }

  /**
   * Localized display labels for the shared vocabularies + set names.
   *
   * Returns, per shared vocabulary, a canonical-English-label → localized-label
   * map (plus set code → localized name), built by zipping this language's
   * dataset against English. The term-translation command applies these as
   * Drupal translations onto the shared terms / set nodes. English returns
   * empty maps (nothing to translate).
   *
   * @return array{ink_color:array<string,string>,card_classification:array<string,string>,keyword_ability:array<string,string>,sets:array<string,string>}
   */
  public function getLocalizedLabels(string $langcode): array {
    $out = ['ink_color' => [], 'card_classification' => [], 'keyword_ability' => [], 'sets' => []];
    if ($langcode === 'en') {
      return $out;
    }
    $enById = [];
    foreach ($this->dataset('en')['cards'] as $cards) {
      foreach ($cards as $card) {
        $enById[(string) ($card['id'] ?? '')] = $card;
      }
    }
    foreach ($this->dataset($langcode)['cards'] as $cards) {
      foreach ($cards as $card) {
        $en = $enById[(string) ($card['id'] ?? '')] ?? NULL;
        if ($en === NULL) {
          continue;
        }
        $this->zipEnToLocalized($out['ink_color'], $this->extractColors($en), $this->extractColors($card), self::INK_MAP);
        $this->zipEnToLocalized($out['card_classification'], array_map('strval', $en['subtypes'] ?? []), array_map('strval', $card['subtypes'] ?? []));
        $this->zipEnToLocalized($out['keyword_ability'], $this->keywordNames($en), $this->keywordNames($card));
      }
    }
    foreach ($this->dataset($langcode)['sets'] as $code => $set) {
      if (!empty($set['name'])) {
        $out['sets'][(string) $code] = (string) $set['name'];
      }
    }
    return $out;
  }

  /**
   * Records canonical-English-label → localized-label from two aligned lists.
   *
   * @param array<string,string> $map
   * @param string[] $english
   * @param string[] $localized
   * @param array<string,string>|null $normalize
   *   Optional map applied to the English label first (e.g. INK_MAP, so the
   *   key becomes our canonical term name rather than the raw dataset value).
   */
  private function zipEnToLocalized(array &$map, array $english, array $localized, ?array $normalize = NULL): void {
    foreach ($english as $i => $label) {
      if (!isset($localized[$i]) || $label === '') {
        continue;
      }
      $key = $normalize === NULL ? $label : ($normalize[mb_strtolower($label)] ?? NULL);
      if ($key !== NULL && $key !== '') {
        $map[$key] = $localized[$i];
      }
    }
  }

  /**
   * Keyword-ability names on a card, in source order.
   *
   * @param array<string,mixed> $row
   *
   * @return string[]
   */
  private function keywordNames(array $row): array {
    $names = [];
    foreach ($row['abilities'] ?? [] as $ability) {
      if (($ability['type'] ?? '') === 'keyword' && !empty($ability['keyword'])) {
        $names[] = (string) $ability['keyword'];
      }
    }
    return $names;
  }

  /**
   * Builds (and memoises) a localized-label → English-label map for a language.
   *
   * Pairs each card with its English counterpart by id and zips the subtype
   * and keyword lists positionally, which lorcanaJSON keeps aligned across
   * languages.
   *
   * @return array<string,string>
   */
  private function labelMap(string $langcode): array {
    if (isset($this->labelMaps[$langcode])) {
      return $this->labelMaps[$langcode];
    }
    $enById = [];
    foreach ($this->dataset('en')['cards'] as $cards) {
      foreach ($cards as $card) {
        $enById[(string) ($card['id'] ?? '')] = $card;
      }
    }
    $map = [];
    foreach ($this->dataset($langcode)['cards'] as $cards) {
      foreach ($cards as $card) {
        $en = $enById[(string) ($card['id'] ?? '')] ?? NULL;
        if ($en === NULL) {
          continue;
        }
        $this->zipLabels($map, array_map('strval', $card['subtypes'] ?? []), array_map('strval', $en['subtypes'] ?? []));
        $this->zipLabels($map, $this->keywordNames($card), $this->keywordNames($en));
      }
    }
    return $this->labelMaps[$langcode] = $map;
  }

  /**
   * Records localized → English label pairs from two aligned lists.
   *
   * @param array<string,string> $map
   * @param string[] $localized
   * @param string[] $english
   */
  private function zipLabels(array &$map, array $localized, array $english): void {
    foreach ($localized as $i => $label) {
      if (isset($english[$i]) && $label !== '') {
        $map[mb_strtolower($label)] = $english[$i];
      }
    }
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
