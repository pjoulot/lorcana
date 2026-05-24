<?php

declare(strict_types=1);

namespace Drupal\lorcana_cards\Plugin\Block;

use Drupal\Core\Block\Attribute\Block;
use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\StringTranslation\TranslatableMarkup;

/**
 * Inkfolk homepage "Popular cards" strip — section header + grid of
 * N most-recently-released cards in teaser view mode.
 */
#[Block(
  id: 'inkfolk_popular_cards',
  admin_label: new TranslatableMarkup('Inkfolk: Popular cards'),
  category: new TranslatableMarkup('Inkfolk'),
)]
final class InkfolkPopularCardsBlock extends BlockBase {

  public function defaultConfiguration(): array {
    return [
      'eyebrow' => '',
      'title' => '',
      'see_all_label' => '',
      'see_all_url' => '/cards',
      'count' => 6,
    ] + parent::defaultConfiguration();
  }

  /**
   * Translatable default labels, used when the block config leaves them blank.
   */
  private function defaultLabels(): array {
    return [
      'eyebrow' => $this->t('Trending this week'),
      'title' => $this->t('Popular cards'),
      'see_all_label' => $this->t('See all cards →'),
    ];
  }

  public function blockForm($form, FormStateInterface $form_state): array {
    $cfg = $this->configuration;
    $defaults = $this->defaultLabels();
    $form['eyebrow'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Eyebrow'),
      '#default_value' => $cfg['eyebrow'],
      '#placeholder' => $defaults['eyebrow'],
    ];
    $form['title'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Section title'),
      '#default_value' => $cfg['title'],
      '#placeholder' => $defaults['title'],
      '#description' => $this->t('Leave blank to use the translatable default.'),
    ];
    $form['see_all_label'] = [
      '#type' => 'textfield',
      '#title' => $this->t('See-all link label'),
      '#default_value' => $cfg['see_all_label'],
      '#placeholder' => $defaults['see_all_label'],
      '#description' => $this->t('Leave blank to use the translatable default.'),
    ];
    $form['see_all_url'] = [
      '#type' => 'textfield',
      '#title' => $this->t('See-all link URL'),
      '#default_value' => $cfg['see_all_url'],
    ];
    $form['count'] = [
      '#type' => 'number',
      '#title' => $this->t('How many cards to show'),
      '#default_value' => $cfg['count'],
      '#min' => 1,
      '#max' => 24,
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
    $defaults = $this->defaultLabels();
    $node_storage = \Drupal::entityTypeManager()->getStorage('node');
    $view_builder = \Drupal::entityTypeManager()->getViewBuilder('node');

    $ids = $node_storage->getQuery()
      ->accessCheck(TRUE)
      ->condition('type', 'card')
      ->condition('status', 1)
      ->exists('field_card_art')
      ->sort('field_released_at', 'DESC')
      ->sort('nid', 'DESC')
      ->range(0, max(1, (int) $cfg['count']))
      ->execute();
    $cards = [];
    foreach ($node_storage->loadMultiple($ids) as $card) {
      $cards[] = $view_builder->view($card, 'teaser');
    }

    return [
      '#theme' => 'inkfolk_popular',
      '#eyebrow' => $cfg['eyebrow'] !== '' ? $cfg['eyebrow'] : $defaults['eyebrow'],
      '#title' => $cfg['title'] !== '' ? $cfg['title'] : $defaults['title'],
      '#see_all_label' => $cfg['see_all_label'] !== '' ? $cfg['see_all_label'] : $defaults['see_all_label'],
      '#see_all_url' => $cfg['see_all_url'],
      '#cards' => $cards,
      '#cache' => [
        'tags' => ['node_list:card'],
        'contexts' => ['languages:language_interface'],
      ],
    ];
  }

}
