<?php

declare(strict_types=1);

namespace Drupal\lorcana_cards\Service;

use Drupal\Core\Logger\LoggerChannelFactoryInterface;
use Drupal\Core\Logger\LoggerChannelInterface;

/**
 * AVIF (or any Imagick-decodable input) → JPG transcoder.
 *
 * Per spec 3: we serve JPG at q=88, never the original AVIF, so there's no
 * <picture> fallback needed downstream.
 */
final class ImageConverter {

  private LoggerChannelInterface $logger;

  public function __construct(LoggerChannelFactoryInterface $loggerFactory) {
    $this->logger = $loggerFactory->get('lorcana_cards');
  }

  public function toJpg(string $inputPath, string $outputPath, int $quality = 88): bool {
    if (!class_exists(\Imagick::class)) {
      $this->logger->error('Imagick extension is not available; cannot transcode @path.', ['@path' => $inputPath]);
      return FALSE;
    }
    try {
      $img = new \Imagick($inputPath);
      $img->setImageFormat('jpeg');
      $img->setImageCompressionQuality($quality);
      $img->setImageColorspace(\Imagick::COLORSPACE_SRGB);
      $img->stripImage();
      $img->writeImage($outputPath);
      $img->clear();
      return TRUE;
    }
    catch (\ImagickException $e) {
      $this->logger->error('Imagick transcode failed for @input: @msg', [
        '@input' => $inputPath,
        '@msg' => $e->getMessage(),
      ]);
      return FALSE;
    }
  }

}
