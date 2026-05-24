<?php

declare(strict_types=1);

namespace Drupal\lorcana_cards\Plugin\Layout;

use Drupal\Core\Form\FormStateInterface;

/**
 * Adds configurable top/bottom spacing to a Layout Builder section layout.
 *
 * Used by the Inkfolk one/two/three-column layouts (which replace the core
 * layouts via hook_layout_alter). Spacing renders as layout--space-{top,bottom}-*
 * classes on the layout wrapper; the editorial CSS maps each step to padding.
 */
trait SpacingLayoutTrait {

  protected function spacingOptions(): array {
    return [
      'none' => $this->t('None'),
      's' => $this->t('Small'),
      'm' => $this->t('Medium'),
      'l' => $this->t('Large'),
    ];
  }

  protected function spacingDefaults(): array {
    return ['top_spacing' => 'none', 'bottom_spacing' => 'none'];
  }

  protected function buildSpacingForm(array $form): array {
    $config = $this->getConfiguration();
    $form['top_spacing'] = [
      '#type' => 'select',
      '#title' => $this->t('Top spacing'),
      '#options' => $this->spacingOptions(),
      '#default_value' => $config['top_spacing'] ?? 'none',
    ];
    $form['bottom_spacing'] = [
      '#type' => 'select',
      '#title' => $this->t('Bottom spacing'),
      '#options' => $this->spacingOptions(),
      '#default_value' => $config['bottom_spacing'] ?? 'none',
    ];
    return $form;
  }

  protected function submitSpacing(FormStateInterface $form_state): void {
    $this->configuration['top_spacing'] = $form_state->getValue('top_spacing');
    $this->configuration['bottom_spacing'] = $form_state->getValue('bottom_spacing');
  }

  protected function spacingClasses(): array {
    $config = $this->getConfiguration();
    return [
      'layout--space-top-' . ($config['top_spacing'] ?? 'none'),
      'layout--space-bottom-' . ($config['bottom_spacing'] ?? 'none'),
    ];
  }

}
