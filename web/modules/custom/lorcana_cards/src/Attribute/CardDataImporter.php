<?php

declare(strict_types=1);

namespace Drupal\lorcana_cards\Attribute;

use Drupal\Component\Plugin\Attribute\Plugin;

#[\Attribute(\Attribute::TARGET_CLASS)]
final class CardDataImporter extends Plugin {

  public function __construct(
    string $id,
    public readonly string $label,
    public readonly array $supports_languages = [],
    public readonly string $homepage = '',
  ) {
    parent::__construct($id);
  }

}
