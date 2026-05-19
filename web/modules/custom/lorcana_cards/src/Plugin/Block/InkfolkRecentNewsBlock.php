<?php

declare(strict_types=1);

namespace Drupal\lorcana_cards\Plugin\Block;

use Drupal\Core\Block\Attribute\Block;
use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\StringTranslation\TranslatableMarkup;

/**
 * Inkfolk homepage "Recent news" strip — section header + N most-
 * recently-published news articles. The first article renders as
 * the "feature" variant (280px cover + content side-by-side); the
 * rest render as compact rows (80px thumb + content + chevron).
 *
 * Mirrors the design's home.jsx pattern but reads from the live
 * news node bundle. When the bundle is empty (M2 day 1), the block
 * returns nothing — Layout Builder still renders the homepage with
 * an empty slot the editor can drop something else into.
 */
#[Block(
  id: 'inkfolk_recent_news',
  admin_label: new TranslatableMarkup('Inkfolk: Recent news'),
  category: new TranslatableMarkup('Inkfolk'),
)]
final class InkfolkRecentNewsBlock extends BlockBase {

  public function defaultConfiguration(): array {
    return [
      'eyebrow' => 'From the editors',
      'title' => 'Recent news',
      'see_all_label' => 'All articles →',
      'see_all_url' => '/news',
      'count' => 3,
    ] + parent::defaultConfiguration();
  }

  public function blockForm($form, FormStateInterface $form_state): array {
    $cfg = $this->configuration;
    $form['eyebrow'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Eyebrow'),
      '#default_value' => $cfg['eyebrow'],
    ];
    $form['title'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Section title'),
      '#default_value' => $cfg['title'],
      '#required' => TRUE,
    ];
    $form['see_all_label'] = [
      '#type' => 'textfield',
      '#title' => $this->t('See-all link label'),
      '#default_value' => $cfg['see_all_label'],
    ];
    $form['see_all_url'] = [
      '#type' => 'textfield',
      '#title' => $this->t('See-all link URL'),
      '#default_value' => $cfg['see_all_url'],
    ];
    $form['count'] = [
      '#type' => 'number',
      '#title' => $this->t('How many articles to show'),
      '#default_value' => $cfg['count'],
      '#min' => 1,
      '#max' => 8,
    ];
    return $form;
  }

  public function blockSubmit($form, FormStateInterface $form_state): void {
    foreach (['eyebrow', 'title', 'see_all_label', 'see_all_url'] as $k) {
      $this->configuration[$k] = (string) $form_state->getValue($k);
    }
    $this->configuration['count'] = (int) $form_state->getValue('count');
  }

  public function build(): array {
    $cfg = $this->configuration;
    $node_storage = \Drupal::entityTypeManager()->getStorage('node');

    $ids = $node_storage->getQuery()
      ->accessCheck(TRUE)
      ->condition('type', 'news')
      ->condition('status', 1)
      ->exists('field_published_at')
      ->sort('field_published_at', 'DESC')
      ->sort('nid', 'DESC')
      ->range(0, max(1, (int) $cfg['count']))
      ->execute();

    $articles = [];
    foreach ($node_storage->loadMultiple($ids) as $node) {
      $body_summary = $node->get('body')->summary ?? '';
      $body_value = $node->get('body')->value ?? '';
      $excerpt = $body_summary ?: trim(strip_tags($body_value));
      if (mb_strlen($excerpt) > 220) {
        $excerpt = mb_substr($excerpt, 0, 220) . '…';
      }
      $cover_media = $node->get('field_cover')->entity;
      $cover_render = NULL;
      if ($cover_media) {
        $cover_render = \Drupal::entityTypeManager()
          ->getViewBuilder('media')
          ->view($cover_media, 'default');
      }
      $articles[] = [
        'title' => $node->label(),
        'url' => $node->toUrl(),
        'author' => $node->get('field_author')->value,
        'published' => $node->get('field_published_at')->value,
        'category' => $node->get('field_category')->entity
          ? $node->get('field_category')->entity->label()
          : '',
        'excerpt' => $excerpt,
        'cover' => $cover_render,
      ];
    }

    return [
      '#theme' => 'inkfolk_recent_news',
      '#eyebrow' => $cfg['eyebrow'],
      '#title' => $cfg['title'],
      '#see_all_label' => $cfg['see_all_label'],
      '#see_all_url' => $cfg['see_all_url'],
      '#articles' => $articles,
      '#cache' => [
        'tags' => ['node_list:news'],
      ],
    ];
  }

}
