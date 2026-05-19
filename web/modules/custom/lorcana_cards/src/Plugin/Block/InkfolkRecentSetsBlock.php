<?php

declare(strict_types=1);

namespace Drupal\lorcana_cards\Plugin\Block;

use Drupal\Core\Block\Attribute\Block;
use Drupal\Core\Block\BlockBase;
use Drupal\Core\Datetime\DrupalDateTime;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\StringTranslation\TranslatableMarkup;

/**
 * Inkfolk homepage "Recent sets" strip — section header + tile grid
 * of N most-recently-released card_set nodes.
 */
#[Block(
  id: 'inkfolk_recent_sets',
  admin_label: new TranslatableMarkup('Inkfolk: Recent sets'),
  category: new TranslatableMarkup('Inkfolk'),
)]
final class InkfolkRecentSetsBlock extends BlockBase {

  public function defaultConfiguration(): array {
    return [
      'eyebrow' => 'By release',
      'title' => 'Browse sets',
      'see_all_label' => 'All sets →',
      'see_all_url' => '/sets',
      'count' => 4,
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
      '#title' => $this->t('How many sets to show'),
      '#default_value' => $cfg['count'],
      '#min' => 1,
      '#max' => 12,
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

    $set_ids = $node_storage->getQuery()
      ->accessCheck(TRUE)
      ->condition('type', 'card_set')
      ->condition('status', 1)
      ->exists('field_released_at')
      ->sort('field_released_at', 'DESC')
      ->range(0, max(1, (int) $cfg['count']))
      ->execute();

    $sets = [];
    foreach ($node_storage->loadMultiple($set_ids) as $set) {
      $card_count = (int) $node_storage->getQuery()
        ->accessCheck(TRUE)
        ->condition('type', 'card')
        ->condition('field_set', $set->id())
        ->count()
        ->execute();
      $released = $set->get('field_released_at')->value;
      $sets[] = [
        'title' => $set->label(),
        'url' => $set->toUrl(),
        'code' => $set->get('field_set_code')->value,
        'card_count' => $card_count,
        'released' => $released
          ? DrupalDateTime::createFromFormat('Y-m-d', $released)->format('M Y')
          : '',
      ];
    }

    return [
      '#theme' => 'inkfolk_sets',
      '#eyebrow' => $cfg['eyebrow'],
      '#title' => $cfg['title'],
      '#see_all_label' => $cfg['see_all_label'],
      '#see_all_url' => $cfg['see_all_url'],
      '#sets' => $sets,
      '#cache' => [
        'tags' => ['node_list:card_set', 'node_list:card'],
      ],
    ];
  }

}
