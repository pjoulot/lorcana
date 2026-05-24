<?php

declare(strict_types=1);

namespace Drupal\lorcana_cards\Plugin\Block;

use Drupal\Core\Block\Attribute\Block;
use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\StringTranslation\TranslatableMarkup;

/**
 * "On this page" — an auto table of contents.
 *
 * Renders an empty sticky nav; js/toc.js builds the link list at runtime from
 * the headings (.if-rt__body h2) in the page's main content and adds scroll-spy.
 * Reusable on any long editorial page.
 */
#[Block(
  id: 'inkfolk_toc',
  admin_label: new TranslatableMarkup('Inkfolk: On this page (auto TOC)'),
  category: new TranslatableMarkup('Inkfolk'),
)]
final class InkfolkTocBlock extends BlockBase {

  public function defaultConfiguration(): array {
    return ['heading' => ''] + parent::defaultConfiguration();
  }

  public function blockForm($form, FormStateInterface $form_state): array {
    $form['heading'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Heading'),
      '#default_value' => $this->configuration['heading'],
      '#placeholder' => $this->t('On this page'),
      '#description' => $this->t('Leave blank to use the translatable default.'),
    ];
    return $form;
  }

  public function blockSubmit($form, FormStateInterface $form_state): void {
    $this->configuration['heading'] = (string) $form_state->getValue('heading');
  }

  public function build(): array {
    $heading = $this->configuration['heading'] !== '' ? $this->configuration['heading'] : $this->t('On this page');
    return [
      '#theme' => 'inkfolk_toc',
      '#heading' => $heading,
      '#attached' => ['library' => ['inkfolk/toc']],
      '#cache' => ['contexts' => ['languages:language_interface']],
    ];
  }

}
