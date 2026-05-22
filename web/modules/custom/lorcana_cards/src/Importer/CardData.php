<?php

declare(strict_types=1);

namespace Drupal\lorcana_cards\Importer;

/**
 * Plugin-neutral DTO representing one (printing, language) record.
 *
 * Populated by CardDataImporter plugins from their upstream source;
 * consumed by CardUpserter to write a Drupal card node.
 */
final class CardData {

  /**
   * @param array<string,string> $imageUris
   *   Map of size key → URL: 'small'|'normal'|'large' → AVIF/JPG URL.
   * @param string[] $inks
   *   Ink colour labels (Amber, Steel, …). Empty for inkless cards; two
   *   entries for dual-ink cards (sets 9+). The upserter resolves them to
   *   ink_color taxonomy terms on the multi-value field_ink.
   * @param string[] $cardTypes
   *   Lowercase machine names from our enum: character, action, item,
   *   location, song.
   * @param string[] $classifications
   *   Free-form classification labels (Hero, Villain, Princess, …) as they
   *   appear upstream. The upserter resolves them to taxonomy terms.
   * @param string[] $keywords
   *   Free-form keyword labels (Bodyguard, Challenger, …). Parameter values
   *   (Challenger +2) are not captured in this v1 shape; they will move to a
   *   custom field type later.
   * @param string[] $illustrators
   * @param array<string,mixed> $sourceFields
   *   Anything else the upstream returned that we don't yet model. Useful for
   *   introspection before committing to schema changes.
   */
  public function __construct(
    public readonly string $sourceId,
    public readonly string $language,
    public readonly string $lorcastId,
    public readonly string $setCode,
    public readonly string $collectorNumber,
    public readonly string $name,
    public readonly ?string $version,
    public readonly string $layout,
    public readonly int $cost,
    public readonly bool $inkable,
    public readonly array $inks,
    public readonly array $cardTypes,
    public readonly array $classifications,
    public readonly ?int $strength,
    public readonly ?int $willpower,
    public readonly ?int $lore,
    public readonly ?int $moveCost,
    public readonly ?string $text,
    public readonly ?string $flavorText,
    public readonly array $keywords,
    public readonly string $rarity,
    public readonly array $illustrators,
    public readonly array $imageUris,
    public readonly ?int $tcgplayerId,
    public readonly string $legalCore,
    public readonly ?string $priceUsd,
    public readonly ?string $priceUsdFoil,
    public readonly ?string $releasedAt,
    public readonly string $printingGroupId,
    public readonly array $sourceFields = [],
  ) {}

}
