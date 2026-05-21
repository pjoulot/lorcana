<?php

declare(strict_types=1);

namespace Drupal\lorcana_cards\Search;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\search_api\Query\QueryInterface;

/**
 * Translates a Scryfall-like query string into Search API conditions.
 *
 * Power users can type structured filters in the encyclopedia search bar —
 * `ink:amber t:character cost<=3 lore>=2 elsa` — instead of (or alongside)
 * clicking facets. Recognised `field:value` / `field<op>value` tokens are
 * lifted out and applied as conditions on the `cards` index; whatever text is
 * left over stays as the fulltext keys. When no token is recognised the query
 * is left untouched, so a plain "ariel" search still works.
 *
 * See specs/04-news-and-encyclopedia.md#search-query-syntax.
 */
final class CardSearchSyntax {

  /**
   * Recognised field aliases → canonical field key.
   */
  private const ALIASES = [
    'ink' => 'ink',
    'color' => 'ink',
    'c' => 'ink',
    'cost' => 'cost',
    'lore' => 'lore',
    'strength' => 'strength',
    'str' => 'strength',
    'power' => 'strength',
    'pow' => 'strength',
    'willpower' => 'willpower',
    'will' => 'willpower',
    'wp' => 'willpower',
    'type' => 'type',
    't' => 'type',
    'rarity' => 'rarity',
    'r' => 'rarity',
    'set' => 'set',
    's' => 'set',
    'keyword' => 'keyword',
    'kw' => 'keyword',
    'k' => 'keyword',
    'classification' => 'class',
    'class' => 'class',
    'num' => 'cn',
    'cn' => 'cn',
    'collector' => 'cn',
    'language' => 'lang',
    'lang' => 'lang',
  ];

  /**
   * Canonical key → index field for numeric fields (comparators allowed).
   */
  private const NUMERIC = [
    'cost' => 'cost',
    'lore' => 'lore',
    'strength' => 'strength',
    'willpower' => 'willpower',
  ];

  /**
   * One token + operator + value, plus value-or-quoted-value.
   */
  private const TOKEN_PATTERN = '/([a-zA-Z]+)(>=|<=|>|<|=|:)("[^"]*"|\S+)/';

  /**
   * Lowercased ink-name → term-id map, built lazily.
   *
   * @var array<string,int>|null
   */
  private ?array $inkMap = NULL;

  /**
   * Lowercased keyword machine-name and label → term-id map, built lazily.
   *
   * @var array<string,int>|null
   */
  private ?array $keywordMap = NULL;

  /**
   * Lowercased classification-name → term-id map, built lazily.
   *
   * @var array<string,int>|null
   */
  private ?array $classMap = NULL;

  /**
   * Resolved set-code → node-id lookups, keyed by code.
   *
   * @var array<string,int|null>
   */
  private array $setNids = [];

  public function __construct(
    private readonly EntityTypeManagerInterface $entityTypeManager,
  ) {}

  /**
   * Parses the query's keys and rewrites it with syntax conditions applied.
   */
  public function applyTo(QueryInterface $query): void {
    $keys = $query->getOriginalKeys();
    if (!is_string($keys) || $keys === '') {
      return;
    }

    [$tokens, $text] = $this->parse($keys);
    if (!$tokens) {
      // No recognised syntax — leave the plain fulltext query as-is.
      return;
    }

    foreach ($tokens as $token) {
      $this->applyToken($query, $token['field'], $token['op'], $token['value']);
    }

    // Whatever is left over is the free-text portion of the search.
    $query->keys($text !== '' ? $text : NULL);
  }

  /**
   * Splits a raw query string into recognised tokens and leftover free text.
   *
   * @return array{0: list<array{field: string, op: string, value: string}>, 1: string}
   *   The parsed tokens and the remaining free text.
   */
  public function parse(string $keys): array {
    $tokens = [];
    $remainder = preg_replace_callback(
      self::TOKEN_PATTERN,
      function (array $m) use (&$tokens): string {
        $field = self::ALIASES[strtolower($m[1])] ?? NULL;
        if ($field === NULL) {
          // Not a known field — keep it as free text.
          return $m[0];
        }
        $tokens[] = [
          'field' => $field,
          'op' => $m[2],
          'value' => trim($m[3], '"'),
        ];
        return ' ';
      },
      $keys,
    );

    $text = trim(preg_replace('/\s+/', ' ', $remainder ?? ''));

    return [$tokens, $text];
  }

  /**
   * Applies a single parsed token as a condition on the query.
   */
  private function applyToken(QueryInterface $query, string $field, string $op, string $value): void {
    if (isset(self::NUMERIC[$field])) {
      if (is_numeric($value)) {
        $query->addCondition(self::NUMERIC[$field], (int) $value, $this->comparator($op));
      }
      return;
    }

    switch ($field) {
      case 'type':
        $query->addCondition('card_types', strtolower($value), '=');
        return;

      case 'rarity':
        $query->addCondition('rarity', $this->normalizeRarity($value), '=');
        return;

      case 'cn':
        $query->addCondition('collector_number', $value, '=');
        return;

      case 'lang':
        $query->addCondition('langcode', strtolower($value), '=');
        return;

      case 'ink':
        $query->addCondition('ink', $this->inkMap()[strtolower($value)] ?? 0, '=');
        return;

      case 'keyword':
        $query->addCondition('keywords', $this->keywordMap()[strtolower($value)] ?? 0, '=');
        return;

      case 'class':
        $query->addCondition('classifications', $this->classMap()[strtolower($value)] ?? 0, '=');
        return;

      case 'set':
        $query->addCondition('set', $this->setNid($value) ?? 0, '=');
        return;
    }
  }

  /**
   * Maps a typed operator to a Search API condition operator.
   *
   * `:` and `=` mean exact match; the rest pass through unchanged.
   */
  private function comparator(string $op): string {
    return ($op === ':' || $op === '=') ? '=' : $op;
  }

  /**
   * Normalises a rarity value to its stored machine form (e.g. super_rare).
   */
  private function normalizeRarity(string $value): string {
    $value = str_replace([' ', '-'], '_', strtolower($value));
    return $value === 'superrare' ? 'super_rare' : $value;
  }

  /**
   * Lowercased ink term name → term id.
   *
   * @return array<string,int>
   *   Lowercased ink term name keyed to its taxonomy term id.
   */
  private function inkMap(): array {
    return $this->inkMap ??= $this->termNameMap('ink_color');
  }

  /**
   * Lowercased classification term name → term id.
   *
   * @return array<string,int>
   *   Lowercased classification term name keyed to its taxonomy term id.
   */
  private function classMap(): array {
    return $this->classMap ??= $this->termNameMap('card_classification');
  }

  /**
   * Lowercased keyword machine name (and label) → term id.
   *
   * @return array<string,int>
   *   Lowercased keyword machine name and label keyed to its term id.
   */
  private function keywordMap(): array {
    if ($this->keywordMap !== NULL) {
      return $this->keywordMap;
    }
    $map = [];
    $terms = $this->entityTypeManager->getStorage('taxonomy_term')
      ->loadByProperties(['vid' => 'keyword_ability']);
    foreach ($terms as $term) {
      $map[strtolower($term->label())] = (int) $term->id();
      if ($term->hasField('field_machine_name') && !$term->get('field_machine_name')->isEmpty()) {
        $map[strtolower($term->get('field_machine_name')->value)] = (int) $term->id();
      }
    }
    return $this->keywordMap = $map;
  }

  /**
   * Builds a lowercased term-name → term-id map for a vocabulary.
   *
   * @return array<string,int>
   *   Lowercased term name keyed to its taxonomy term id.
   */
  private function termNameMap(string $vid): array {
    $map = [];
    $terms = $this->entityTypeManager->getStorage('taxonomy_term')
      ->loadByProperties(['vid' => $vid]);
    foreach ($terms as $term) {
      $map[strtolower($term->label())] = (int) $term->id();
    }
    return $map;
  }

  /**
   * Resolves a set code (as typed) to its card_set node id.
   */
  private function setNid(string $code): ?int {
    if (array_key_exists($code, $this->setNids)) {
      return $this->setNids[$code];
    }
    $ids = $this->entityTypeManager->getStorage('node')->getQuery()
      ->accessCheck(TRUE)
      ->condition('type', 'card_set')
      ->condition('field_set_code', $code)
      ->range(0, 1)
      ->execute();
    return $this->setNids[$code] = $ids ? (int) reset($ids) : NULL;
  }

}
