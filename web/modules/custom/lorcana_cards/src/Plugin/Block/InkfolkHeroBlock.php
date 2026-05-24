<?php

declare(strict_types=1);

namespace Drupal\lorcana_cards\Plugin\Block;

use Drupal\Core\Block\Attribute\Block;
use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\StringTranslation\TranslatableMarkup;

/**
 * Inkfolk homepage hero band — admin-editable copy + dynamic widgets.
 *
 * Static text (title, copy, search placeholder, try-examples) is
 * config the editor fills in via Layout Builder's block form. The
 * "latest set" chip and the 5-card spread are computed at render
 * time from entity queries so the homepage stays accurate without
 * editor intervention.
 */
#[Block(
  id: 'inkfolk_hero',
  admin_label: new TranslatableMarkup('Inkfolk: Hero'),
  category: new TranslatableMarkup('Inkfolk'),
)]
final class InkfolkHeroBlock extends BlockBase {

  public function defaultConfiguration(): array {
    return [
      'title' => '',
      'title_accent' => '',
      'copy' => '',
      'search_placeholder' => '',
      'try_examples' => "ink:ruby cost<=3\nt:song r:rare\nset:archazia ink:amber\nkw:singer",
      'show_chip' => TRUE,
      'show_spread' => TRUE,
    ] + parent::defaultConfiguration();
  }

  /**
   * Translatable default copy, used when the block config leaves a field blank.
   */
  private function defaultLabels(): array {
    return [
      'title' => $this->t('Every Lorcana card,'),
      'title_accent' => $this->t('at a glance.'),
      'copy' => $this->t('A fan-made, ad-free database for searching cards, planning decks, and drafting with friends. EN · FR.'),
      'search_placeholder' => $this->t('Search cards, abilities, sets…'),
    ];
  }

  public function blockForm($form, FormStateInterface $form_state): array {
    $cfg = $this->configuration;
    $defaults = $this->defaultLabels();
    $form['title'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Title — first clause'),
      '#default_value' => $cfg['title'],
      '#placeholder' => $defaults['title'],
      '#description' => $this->t('Big serif heading, regular weight. Leave blank to use the translatable default.'),
    ];
    $form['title_accent'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Title — italic accent'),
      '#default_value' => $cfg['title_accent'],
      '#placeholder' => $defaults['title_accent'],
      '#description' => $this->t('Italic clause painted in --accent. Leave blank to use the translatable default.'),
    ];
    $form['copy'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Description'),
      '#default_value' => $cfg['copy'],
      '#placeholder' => $defaults['copy'],
      '#rows' => 2,
    ];
    $form['search_placeholder'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Search placeholder'),
      '#default_value' => $cfg['search_placeholder'],
      '#placeholder' => $defaults['search_placeholder'],
    ];
    $form['try_examples'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Try-examples'),
      '#default_value' => $cfg['try_examples'],
      '#description' => $this->t('One query per line; each becomes a clickable mono chip pointing at /cards?search=…'),
      '#rows' => 4,
    ];
    $form['show_chip'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Show "latest set live" chip'),
      '#default_value' => $cfg['show_chip'],
    ];
    $form['show_spread'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Show 5-card spread on the right'),
      '#default_value' => $cfg['show_spread'],
    ];
    return $form;
  }

  public function blockSubmit($form, FormStateInterface $form_state): void {
    foreach (['title', 'title_accent', 'copy', 'search_placeholder', 'try_examples'] as $k) {
      $this->configuration[$k] = (string) $form_state->getValue($k);
    }
    foreach (['show_chip', 'show_spread'] as $k) {
      $this->configuration[$k] = (bool) $form_state->getValue($k);
    }
  }

  public function build(): array {
    $cfg = $this->configuration;
    $defaults = $this->defaultLabels();
    $node_storage = \Drupal::entityTypeManager()->getStorage('node');
    $view_builder = \Drupal::entityTypeManager()->getViewBuilder('node');

    $latest_set = NULL;
    $latest_set_card_count = 0;
    if (!empty($cfg['show_chip'])) {
      $ids = $node_storage->getQuery()
        ->accessCheck(TRUE)
        ->condition('type', 'card_set')
        ->condition('status', 1)
        ->exists('field_released_at')
        ->sort('field_released_at', 'DESC')
        ->range(0, 1)
        ->execute();
      if ($ids) {
        $latest_set = $node_storage->load(reset($ids));
        $latest_set_card_count = (int) $node_storage->getQuery()
          ->accessCheck(TRUE)
          ->condition('type', 'card')
          ->condition('field_set', $latest_set->id())
          ->count()
          ->execute();
      }
    }

    $spread = [];
    if (!empty($cfg['show_spread'])) {
      $spread_ids = $node_storage->getQuery()
        ->accessCheck(TRUE)
        ->condition('type', 'card')
        ->condition('status', 1)
        ->condition('field_rarity', ['enchanted', 'legendary'], 'IN')
        ->exists('field_card_art')
        ->sort('field_rarity', 'ASC')
        ->sort('nid', 'ASC')
        ->range(0, 5)
        ->execute();
      foreach ($node_storage->loadMultiple($spread_ids) as $card) {
        $spread[] = $view_builder->view($card, 'teaser');
      }
    }

    $try = array_filter(array_map('trim', preg_split("/\r\n|\n|\r/", (string) $cfg['try_examples'])));

    return [
      '#theme' => 'inkfolk_hero',
      '#title' => $cfg['title'] !== '' ? $cfg['title'] : $defaults['title'],
      '#title_accent' => $cfg['title_accent'] !== '' ? $cfg['title_accent'] : $defaults['title_accent'],
      '#copy' => $cfg['copy'] !== '' ? $cfg['copy'] : $defaults['copy'],
      '#search_placeholder' => $cfg['search_placeholder'] !== '' ? $cfg['search_placeholder'] : $defaults['search_placeholder'],
      '#try_examples' => $try,
      '#latest_set' => $latest_set,
      '#latest_set_card_count' => $latest_set_card_count,
      '#spread_cards' => $spread,
      '#cache' => [
        'tags' => ['node_list:card', 'node_list:card_set'],
        'contexts' => ['languages:language_interface'],
      ],
    ];
  }

}
