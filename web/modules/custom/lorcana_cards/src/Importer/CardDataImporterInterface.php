<?php

declare(strict_types=1);

namespace Drupal\lorcana_cards\Importer;

interface CardDataImporterInterface {

  public function getId(): string;

  public function getLabel(): string;

  /**
   * @return SetSummary[]
   */
  public function listSets(): array;

  /**
   * @return \Generator<CardData>
   */
  public function fetchCardsForSet(string $setCode, string $langcode): \Generator;

  /**
   * @return string[]
   */
  public function supportedLanguages(): array;

  public function supportsPriceRefresh(): bool;

  /**
   * @return \Generator<array{lorcast_id:string,price_usd:?string,price_usd_foil:?string}>
   */
  public function fetchPricesForSet(string $setCode): \Generator;

}
