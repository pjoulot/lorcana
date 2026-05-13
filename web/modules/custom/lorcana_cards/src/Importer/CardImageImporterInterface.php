<?php

declare(strict_types=1);

namespace Drupal\lorcana_cards\Importer;

interface CardImageImporterInterface {

  public function getId(): string;

  public function getLabel(): string;

  public function supports(CardData $card): bool;

  /**
   * @param 'small'|'normal'|'large' $size
   * @return string|null Local filesystem path to a JPG, or NULL if unavailable.
   */
  public function fetchImage(CardData $card, string $size): ?string;

}
