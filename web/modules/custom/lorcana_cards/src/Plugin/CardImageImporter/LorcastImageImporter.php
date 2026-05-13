<?php

declare(strict_types=1);

namespace Drupal\lorcana_cards\Plugin\CardImageImporter;

use Drupal\Core\File\FileSystemInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\Core\Plugin\PluginBase;
use Drupal\lorcana_cards\Attribute\CardImageImporter;
use Drupal\lorcana_cards\Importer\CardData;
use Drupal\lorcana_cards\Importer\CardImageImporterInterface;
use Drupal\lorcana_cards\Service\ImageConverter;
use GuzzleHttp\ClientInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

#[CardImageImporter(
  id: 'lorcast',
  label: 'Lorcast (AVIF → JPG)',
  homepage: 'https://lorcast.com',
)]
final class LorcastImageImporter extends PluginBase implements CardImageImporterInterface, ContainerFactoryPluginInterface {

  private const RATE_LIMIT_MICROSECONDS = 100_000;

  public function __construct(
    array $configuration,
    string $plugin_id,
    mixed $plugin_definition,
    private readonly ClientInterface $httpClient,
    private readonly ImageConverter $converter,
    private readonly FileSystemInterface $fileSystem,
  ) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
  }

  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition): self {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('http_client'),
      $container->get('lorcana_cards.image_converter'),
      $container->get('file_system'),
    );
  }

  public function getId(): string {
    return $this->pluginId;
  }

  public function getLabel(): string {
    return (string) $this->pluginDefinition['label'];
  }

  public function supports(CardData $card): bool {
    // Anything sourced from Lorcast and carrying its image URLs.
    return !empty($card->imageUris);
  }

  public function fetchImage(CardData $card, string $size): ?string {
    $url = $card->imageUris[$size] ?? NULL;
    if (!$url) {
      return NULL;
    }

    usleep(self::RATE_LIMIT_MICROSECONDS);

    $tempDir = $this->fileSystem->getTempDirectory();
    $avifPath = $tempDir . '/lorcast-' . bin2hex(random_bytes(8)) . '.avif';
    $jpgPath = $avifPath . '.jpg';

    try {
      $response = $this->httpClient->request('GET', $url, ['timeout' => 30]);
      file_put_contents($avifPath, (string) $response->getBody());
      if (!$this->converter->toJpg($avifPath, $jpgPath)) {
        return NULL;
      }
      return $jpgPath;
    }
    catch (\Throwable) {
      return NULL;
    }
    finally {
      if (file_exists($avifPath)) {
        @unlink($avifPath);
      }
    }
  }

}
