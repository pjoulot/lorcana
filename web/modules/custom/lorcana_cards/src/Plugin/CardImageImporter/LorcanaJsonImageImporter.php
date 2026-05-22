<?php

declare(strict_types=1);

namespace Drupal\lorcana_cards\Plugin\CardImageImporter;

use Drupal\Core\File\FileSystemInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\Core\Plugin\PluginBase;
use Drupal\lorcana_cards\Attribute\CardImageImporter;
use Drupal\lorcana_cards\Importer\CardData;
use Drupal\lorcana_cards\Importer\CardImageImporterInterface;
use GuzzleHttp\ClientInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Fetches card art from lorcanaJSON's image URLs.
 *
 * LorcanaJSON points at the official Ravensburger CDN, which already serves
 * per-language JPGs — so unlike the Lorcast pipeline there is no AVIF→JPG
 * conversion step; we download the file as-is.
 */
#[CardImageImporter(
  id: 'lorcana_json',
  label: 'lorcanaJSON (Ravensburger JPG)',
  homepage: 'https://lorcanajson.org',
)]
final class LorcanaJsonImageImporter extends PluginBase implements CardImageImporterInterface, ContainerFactoryPluginInterface {

  private const RATE_LIMIT_MICROSECONDS = 100_000;

  public function __construct(
    array $configuration,
    string $plugin_id,
    mixed $plugin_definition,
    private readonly ClientInterface $httpClient,
    private readonly FileSystemInterface $fileSystem,
  ) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition): self {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('http_client'),
      $container->get('file_system'),
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getId(): string {
    return $this->pluginId;
  }

  /**
   * {@inheritdoc}
   */
  public function getLabel(): string {
    return (string) $this->pluginDefinition['label'];
  }

  /**
   * {@inheritdoc}
   */
  public function supports(CardData $card): bool {
    return !empty($card->imageUris);
  }

  /**
   * {@inheritdoc}
   */
  public function fetchImage(CardData $card): ?string {
    $url = $card->imageUris['large'] ?? $card->imageUris['normal'] ?? $card->imageUris['small'] ?? NULL;
    if (!$url) {
      return NULL;
    }

    usleep(self::RATE_LIMIT_MICROSECONDS);

    $jpgPath = $this->fileSystem->getTempDirectory() . '/lorcanajson-' . bin2hex(random_bytes(8)) . '.jpg';

    try {
      $response = $this->httpClient->request('GET', $url, ['timeout' => 30]);
      file_put_contents($jpgPath, (string) $response->getBody());
      return $jpgPath;
    }
    catch (\Throwable) {
      if (file_exists($jpgPath)) {
        @unlink($jpgPath);
      }
      return NULL;
    }
  }

}
