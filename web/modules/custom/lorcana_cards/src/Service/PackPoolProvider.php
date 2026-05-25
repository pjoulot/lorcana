<?php

declare(strict_types=1);

namespace Drupal\lorcana_cards\Service;

use Drupal\Core\Entity\EntityRepositoryInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\file\FileInterface;
use Drupal\image\ImageStyleInterface;
use Drupal\node\NodeInterface;

/**
 * Supplies a set's draftable card pool, grouped by rarity.
 *
 * The draft simulator (spec 05) consumes this to build booster packs. Cards
 * are independent per-language nodes, so a pool is always single-language.
 */
final class PackPoolProvider {

  public function __construct(
    private readonly EntityTypeManagerInterface $entityTypeManager,
    private readonly EntityRepositoryInterface $entityRepository,
  ) {}

  /**
   * Returns a set's cards grouped by rarity machine name.
   *
   * @param string $setCode
   *   The set's field_set_code (e.g. "1" for The First Chapter).
   * @param string $langcode
   *   Language of the card pool to load.
   *
   * @return array<string, array<int, \Drupal\node\NodeInterface>>
   *   Card nodes keyed by rarity; empty if the set is unknown.
   */
  public function getPool(string $setCode, string $langcode = 'en'): array {
    $setId = $this->setIdForCode($setCode);
    if ($setId === NULL) {
      return [];
    }

    $storage = $this->entityTypeManager->getStorage('node');
    $ids = $storage->getQuery()
      ->accessCheck(TRUE)
      ->condition('type', 'card')
      ->condition('status', 1)
      ->condition('langcode', $langcode)
      ->condition('field_set', $setId)
      ->execute();

    $pool = [];
    foreach ($storage->loadMultiple($ids) as $card) {
      assert($card instanceof NodeInterface);
      $rarity = (string) $card->get('field_rarity')->value;
      if ($rarity === '') {
        continue;
      }
      $pool[$rarity][] = $card;
    }

    return $pool;
  }

  /**
   * Builds a compact, render-ready payload for a card.
   *
   * Mirrors the design's card shape (image-first; the licensed art already
   * carries name/cost/stats, so the SPA mostly renders the <img>).
   *
   * @param \Drupal\node\NodeInterface $card
   *   A card node.
   *
   * @return array<string, mixed>
   *   The card payload.
   */
  public function payload(NodeInterface $card): array {
    $version = trim((string) $card->get('field_version')->value);
    $label = (string) $card->label();
    $suffix = ' — ' . $version;
    $name = ($version !== '' && str_ends_with($label, $suffix))
      ? substr($label, 0, -strlen($suffix))
      : $label;

    [$image, $imageLarge] = $this->images($card);

    return [
      'id' => (int) $card->id(),
      'name' => $name,
      'version' => $version !== '' ? $version : NULL,
      'ink' => $this->inkSlug($card),
      'type' => $this->primaryType($card),
      'rarity' => (string) $card->get('field_rarity')->value,
      'cost' => $this->intOrNull($card, 'field_cost'),
      'strength' => $this->intOrNull($card, 'field_strength'),
      'willpower' => $this->intOrNull($card, 'field_willpower'),
      'lore' => $this->intOrNull($card, 'field_lore'),
      'image' => $image,
      'imageLarge' => $imageLarge,
    ];
  }

  /**
   * Loads a set node by its code.
   *
   * @param string $setCode
   *   The set's field_set_code.
   *
   * @return \Drupal\node\NodeInterface|null
   *   The set node, or NULL if no set has that code.
   */
  public function getSet(string $setCode): ?NodeInterface {
    $ids = $this->entityTypeManager->getStorage('node')->getQuery()
      ->accessCheck(TRUE)
      ->condition('type', 'card_set')
      ->condition('field_set_code', $setCode)
      ->range(0, 1)
      ->execute();
    if (!$ids) {
      return NULL;
    }
    $set = $this->entityTypeManager->getStorage('node')->load(reset($ids));

    return $set instanceof NodeInterface ? $set : NULL;
  }

  /**
   * Resolves a set node id from its code.
   */
  private function setIdForCode(string $setCode): ?int {
    $set = $this->getSet($setCode);

    return $set !== NULL ? (int) $set->id() : NULL;
  }

  /**
   * The card's ink as a lowercase English slug (amber, amethyst, …).
   *
   * Matches the theme's slug derivation; forced to English so the CSS ink
   * variables resolve regardless of the card's language.
   */
  private function inkSlug(NodeInterface $card): string {
    $term = $card->get('field_ink')->entity;
    if ($term === NULL) {
      return 'steel';
    }
    $term = $this->entityRepository->getTranslationFromContext($term, 'en');

    return strtolower($term->label());
  }

  /**
   * The first card type, lowercased (character, action, item, …).
   */
  private function primaryType(NodeInterface $card): string {
    $first = $card->get('field_card_types')->first();

    return $first ? strtolower((string) $first->value) : '';
  }

  /**
   * Reads an integer field, or NULL when empty.
   */
  private function intOrNull(NodeInterface $card, string $field): ?int {
    $value = $card->get($field)->value;

    return $value === NULL || $value === '' ? NULL : (int) $value;
  }

  /**
   * Resolves the card art to [medium, large] absolute image-style URLs.
   *
   * @return array{0: string|null, 1: string|null}
   *   The medium and large URLs, or NULLs when no art is attached.
   */
  private function images(NodeInterface $card): array {
    $media = $card->get('field_card_art')->entity;
    if ($media === NULL || !$media->hasField('field_media_image')) {
      return [NULL, NULL];
    }
    $file = $media->get('field_media_image')->entity;
    if (!$file instanceof FileInterface) {
      return [NULL, NULL];
    }
    $uri = $file->getFileUri();

    return [
      $this->styleUrl('medium', $uri),
      $this->styleUrl('large', $uri),
    ];
  }

  /**
   * Builds an absolute image-style URL for a file URI.
   */
  private function styleUrl(string $styleId, string $uri): ?string {
    $style = $this->entityTypeManager->getStorage('image_style')->load($styleId);

    return $style instanceof ImageStyleInterface ? $style->buildUrl($uri) : NULL;
  }

}
