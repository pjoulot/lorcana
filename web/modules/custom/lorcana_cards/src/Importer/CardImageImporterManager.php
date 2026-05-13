<?php

declare(strict_types=1);

namespace Drupal\lorcana_cards\Importer;

use Drupal\Core\Cache\CacheBackendInterface;
use Drupal\Core\Extension\ModuleHandlerInterface;
use Drupal\Core\Plugin\DefaultPluginManager;
use Drupal\lorcana_cards\Attribute\CardImageImporter;

final class CardImageImporterManager extends DefaultPluginManager {

  public function __construct(
    \Traversable $namespaces,
    CacheBackendInterface $cache_backend,
    ModuleHandlerInterface $module_handler,
  ) {
    parent::__construct(
      'Plugin/CardImageImporter',
      $namespaces,
      $module_handler,
      CardImageImporterInterface::class,
      CardImageImporter::class,
    );
    $this->setCacheBackend($cache_backend, 'lorcana_cards_image_importers');
    $this->alterInfo('lorcana_cards_image_importer_info');
  }

}
