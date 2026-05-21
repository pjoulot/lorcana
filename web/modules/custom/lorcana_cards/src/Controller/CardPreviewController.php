<?php

declare(strict_types=1);

namespace Drupal\lorcana_cards\Controller;

use Drupal\Core\Cache\CacheableMetadata;
use Drupal\Core\Cache\CacheableResponse;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Render\RenderContext;
use Drupal\Core\Render\RendererInterface;
use Drupal\node\NodeInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Serves the compact card preview fragment fetched by the popover JS.
 *
 * Returns a small, individually-cacheable HTML fragment (image + key stats)
 * rather than a full page, so a news article carrying many card chips stays
 * lean and each card's preview is cached once and reused across articles.
 */
final class CardPreviewController extends ControllerBase {

  public function __construct(
    private readonly RendererInterface $renderer,
  ) {}

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container): static {
    return new static($container->get('renderer'));
  }

  /**
   * Builds the preview fragment for a single card node.
   */
  public function preview(NodeInterface $node): Response {
    if ($node->bundle() !== 'card') {
      throw new NotFoundHttpException();
    }

    $build = $this->buildPreview($node);

    // Render outside the main render context so we can capture the bubbled
    // cacheability and hand it to the response.
    $context = new RenderContext();
    $html = $this->renderer->executeInRenderContext($context, fn () => $this->renderer->render($build));

    $response = new CacheableResponse((string) $html);
    $response->headers->set('Content-Type', 'text/html; charset=UTF-8');

    $metadata = CacheableMetadata::createFromRenderArray($build)->addCacheableDependency($node);
    if (!$context->isEmpty()) {
      $metadata = $metadata->merge(CacheableMetadata::createFromObject($context->pop()));
    }
    $response->addCacheableDependency($metadata);

    return $response;
  }

  /**
   * Assembles the render array for the preview theme hook.
   */
  private function buildPreview(NodeInterface $node): array {
    $ink_term = $node->get('field_ink')->entity;
    $set_node = $node->get('field_set')->entity;

    $types = [];
    foreach ($node->get('field_card_types') as $item) {
      $types[] = ucfirst((string) $item->value);
    }

    // Reuse the encyclopedia teaser's image treatment: the media reference
    // rendered through the thumbnail formatter at the medium image style.
    $image = $node->get('field_card_art')->view([
      'type' => 'media_thumbnail',
      'label' => 'hidden',
      'settings' => ['image_style' => 'medium', 'image_link' => ''],
    ]);

    $labels = [
      'cost' => $this->t('Cost'),
      'strength' => $this->t('Strength'),
      'willpower' => $this->t('Willpower'),
      'lore' => $this->t('Lore'),
    ];
    $stats = [];
    foreach ($labels as $key => $label) {
      $value = $node->get('field_' . $key)->getString();
      if ($value !== '') {
        $stats[$key] = ['label' => $label, 'value' => $value];
      }
    }

    return [
      '#theme' => 'inkfolk_card_preview',
      '#name' => $node->label(),
      '#url' => $node->toUrl()->toString(),
      '#image' => $image,
      '#ink' => $ink_term ? strtolower($ink_term->label()) : '',
      '#ink_label' => $ink_term ? $ink_term->label() : '',
      '#types' => $types,
      '#rarity' => $node->get('field_rarity')->value ? ucfirst(str_replace('_', ' ', (string) $node->get('field_rarity')->value)) : '',
      '#set_label' => $set_node ? $set_node->label() : '',
      '#stats' => $stats,
    ];
  }

}
