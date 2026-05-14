<?php

declare(strict_types=1);

namespace Drupal\lorcana_cards\Importer;

interface CardImageImporterInterface {

  public function getId(): string;

  public function getLabel(): string;

  public function supports(CardData $card): bool;

  /**
   * Fetch and convert the highest-fidelity image available for this card.
   * Downstream resizing happens via Drupal image styles, so plugins should
   * return the largest source they have access to.
   *
   * @return string|null Local filesystem path to a JPG, or NULL if unavailable.
   */
  public function fetchImage(CardData $card): ?string;

}
