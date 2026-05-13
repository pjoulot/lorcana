<?php

declare(strict_types=1);

namespace Drupal\lorcana_cards\Importer;

use Drupal\Core\Cache\CacheBackendInterface;
use Drupal\Core\Extension\ModuleHandlerInterface;
use Drupal\Core\Plugin\DefaultPluginManager;
use Drupal\lorcana_cards\Attribute\CardDataImporter;

final class CardDataImporterManager extends DefaultPluginManager {

  public function __construct(
    \Traversable $namespaces,
    CacheBackendInterface $cache_backend,
    ModuleHandlerInterface $module_handler,
  ) {
    parent::__construct(
      'Plugin/CardDataImporter',
      $namespaces,
      $module_handler,
      CardDataImporterInterface::class,
      CardDataImporter::class,
    );
    $this->setCacheBackend($cache_backend, 'lorcana_cards_data_importers');
    $this->alterInfo('lorcana_cards_data_importer_info');
  }

}
