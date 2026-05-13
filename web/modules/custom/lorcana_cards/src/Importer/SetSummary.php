<?php

declare(strict_types=1);

namespace Drupal\lorcana_cards\Importer;

final class SetSummary {

  public function __construct(
    public readonly string $sourceId,
    public readonly string $code,
    public readonly string $name,
    public readonly ?string $releasedAt = NULL,
    public readonly ?string $prereleasedAt = NULL,
  ) {}

}
