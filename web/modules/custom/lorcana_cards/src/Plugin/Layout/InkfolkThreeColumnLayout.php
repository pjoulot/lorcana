<?php

declare(strict_types=1);

namespace Drupal\lorcana_cards\Plugin\Layout;

use Drupal\Core\Form\FormStateInterface;
use Drupal\layout_builder\Plugin\Layout\ThreeColumnLayout;

/**
 * Three-column section layout with configurable top/bottom spacing.
 *
 * Replaces core's layout_threecol_section class via hook_layout_alter(); keeps
 * the inherited column-width setting.
 */
final class InkfolkThreeColumnLayout extends ThreeColumnLayout {

  use SpacingLayoutTrait;

  public function defaultConfiguration() {
    return parent::defaultConfiguration() + $this->spacingDefaults();
  }

  public function buildConfigurationForm(array $form, FormStateInterface $form_state) {
    $form = parent::buildConfigurationForm($form, $form_state);
    return $this->buildSpacingForm($form);
  }

  public function submitConfigurationForm(array &$form, FormStateInterface $form_state) {
    parent::submitConfigurationForm($form, $form_state);
    $this->submitSpacing($form_state);
  }

  public function build(array $regions) {
    $build = parent::build($regions);
    foreach ($this->spacingClasses() as $class) {
      $build['#attributes']['class'][] = $class;
    }
    return $build;
  }

}
