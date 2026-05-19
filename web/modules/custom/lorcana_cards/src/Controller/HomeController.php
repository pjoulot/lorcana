<?php

declare(strict_types=1);

namespace Drupal\lorcana_cards\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Datetime\DrupalDateTime;

/**
 * Renders the public homepage at /home (which doubles as the site front).
 */
final class HomeController extends ControllerBase {

  public function page(): array {
    $node_storage = $this->entityTypeManager()->getStorage('node');
    $view_builder = $this->entityTypeManager()->getViewBuilder('node');

    // Latest set: most recent card_set by release date.
    $latest_set_ids = $node_storage->getQuery()
      ->accessCheck(TRUE)
      ->condition('type', 'card_set')
      ->condition('status', 1)
      ->exists('field_released_at')
      ->sort('field_released_at', 'DESC')
      ->range(0, 1)
      ->execute();
    $latest_set = $latest_set_ids ? $node_storage->load(reset($latest_set_ids)) : NULL;

    $latest_set_card_count = 0;
    if ($latest_set) {
      $latest_set_card_count = (int) $node_storage->getQuery()
        ->accessCheck(TRUE)
        ->condition('type', 'card')
        ->condition('field_set', $latest_set->id())
        ->count()
        ->execute();
    }

    // Card spread: 5 enchanted/legendary cards with art, deterministic so
    // the homepage doesn't reshuffle on every cache rebuild.
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
    $spread = [];
    foreach ($node_storage->loadMultiple($spread_ids) as $card) {
      $spread[] = $view_builder->view($card, 'teaser');
    }

    // Popular cards: 6 most-recently-released cards with art.
    $popular_ids = $node_storage->getQuery()
      ->accessCheck(TRUE)
      ->condition('type', 'card')
      ->condition('status', 1)
      ->exists('field_card_art')
      ->sort('field_released_at', 'DESC')
      ->sort('nid', 'DESC')
      ->range(0, 6)
      ->execute();
    $popular = [];
    foreach ($node_storage->loadMultiple($popular_ids) as $card) {
      $popular[] = $view_builder->view($card, 'teaser');
    }

    // Sets strip: 4 most-recent sets.
    $sets_ids = $node_storage->getQuery()
      ->accessCheck(TRUE)
      ->condition('type', 'card_set')
      ->condition('status', 1)
      ->exists('field_released_at')
      ->sort('field_released_at', 'DESC')
      ->range(0, 4)
      ->execute();
    $sets = [];
    foreach ($node_storage->loadMultiple($sets_ids) as $set) {
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
      '#theme' => 'inkfolk_home',
      '#latest_set' => $latest_set,
      '#latest_set_card_count' => $latest_set_card_count,
      '#spread_cards' => $spread,
      '#popular_cards' => $popular,
      '#sets' => $sets,
      '#cache' => [
        'tags' => ['node_list:card', 'node_list:card_set'],
        'contexts' => ['languages:language_interface'],
      ],
    ];
  }

}
