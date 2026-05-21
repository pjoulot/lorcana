<?php

declare(strict_types=1);

namespace Drupal\lorcana_cards\Plugin\Filter;

use Drupal\Component\Utility\Html;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Language\LanguageManagerInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\Core\StringTranslation\TranslatableMarkup;
use Drupal\Core\Url;
use Drupal\filter\Attribute\Filter;
use Drupal\filter\FilterProcessResult;
use Drupal\filter\Plugin\FilterBase;
use Drupal\filter\Plugin\FilterInterface;
use Drupal\node\NodeInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Resolves `[card:<set>/<number>]` tokens into linked, preview-able chips.
 *
 * Editors type the token directly in CKEditor body text — no custom CKEditor 5
 * plugin (see specs/04-news-and-encyclopedia.md#cross-feature-card-linking).
 * Both `[card:1/207]` and the slug-annotated `[card:1/207-elsa]` are accepted;
 * the slug is decorative and ignored for lookup. The token is matched against
 * `(field_set → field_set_code, field_collector_number)`.
 *
 * A resolved token becomes an anchor to the card's canonical page, carrying a
 * `data-card-preview` URL the popover JS lazy-fetches on hover/tap. An
 * unresolved token degrades to a muted, non-linked span so a typo never breaks
 * the article.
 */
#[Filter(
  id: 'lorcana_card_token',
  title: new TranslatableMarkup('Lorcana card reference tokens'),
  type: FilterInterface::TYPE_TRANSFORM_IRREVERSIBLE,
  description: new TranslatableMarkup('Converts <code>[card:1/207]</code> tokens into linked card chips with a hover preview.'),
  weight: 10,
)]
final class CardTokenFilter extends FilterBase implements ContainerFactoryPluginInterface {

  /**
   * Matches [card:SET/NUMBER] with an optional decorative -slug suffix.
   *
   * Group 1 = set code, group 2 = collector number (both up to the first
   * delimiter). Anything from a trailing hyphen to the closing bracket is the
   * ignored slug.
   */
  private const TOKEN_PATTERN = '/\[card:([^\/\]\s]+)\/([^\]\-\s]+)(?:-[^\]]*)?\]/';

  public function __construct(
    array $configuration,
    string $plugin_id,
    mixed $plugin_definition,
    private readonly EntityTypeManagerInterface $entityTypeManager,
    private readonly LanguageManagerInterface $languageManager,
  ) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition): static {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('entity_type.manager'),
      $container->get('language_manager'),
    );
  }

  /**
   * {@inheritdoc}
   */
  public function process($text, $langcode): FilterProcessResult {
    $result = new FilterProcessResult($text);

    if (!str_contains($text, '[card:')) {
      return $result;
    }

    // A new card import can resolve a previously-broken token, so the cached
    // output must invalidate when any card is created or updated.
    $result->addCacheTags(['node_list:card']);
    // Output varies by content language (the chip links to the matching variant
    // and shows its localized name).
    $result->addCacheContexts(['languages:language_content']);

    $output = preg_replace_callback(
      self::TOKEN_PATTERN,
      function (array $match) use ($result): string {
        return $this->renderToken($match[0], $match[1], $match[2], $result);
      },
      $text,
    );

    $result->setProcessedText($output);

    return $result;
  }

  /**
   * Renders one matched token to HTML, bubbling the card's cacheability.
   */
  private function renderToken(string $raw, string $setCode, string $number, FilterProcessResult $result): string {
    $card = $this->lookupCard($setCode, $number);

    if (!$card instanceof NodeInterface) {
      // Degrade gracefully: keep the literal token visible but flagged, so an
      // editor can spot the typo without the page breaking.
      return '<span class="if-card-link if-card-link--missing" title="' . Html::escape((string) $this->t('Unknown card')) . '">'
        . Html::escape($raw) . '</span>';
    }

    $result->addCacheableDependency($card);

    $ink_term = $card->get('field_ink')->entity;
    $ink_slug = $ink_term ? Html::getClass(strtolower($ink_term->label())) : '';

    $href = $card->toUrl()->toString();
    $preview = Url::fromRoute('lorcana_cards.card_preview', ['node' => $card->id()])->toString();

    $dot = $ink_slug
      ? '<span class="if-card-link__dot if-swatch if-swatch--' . $ink_slug . '" aria-hidden="true"></span>'
      : '';

    // The popover library is only needed once a resolved chip is on the page.
    $result->setAttachments(array_merge_recursive(
      $result->getAttachments(),
      ['library' => ['inkfolk/card-popover']],
    ));

    return '<a class="if-card-link" href="' . Html::escape($href) . '"'
      . ' data-card-id="' . (int) $card->id() . '"'
      . ' data-card-preview="' . Html::escape($preview) . '">'
      . $dot . Html::escape($card->label())
      . '</a>';
  }

  /**
   * Finds a card node by set code + collector number.
   *
   * Prefers the active content language when several language variants share
   * the same set/number.
   */
  private function lookupCard(string $setCode, string $number): ?NodeInterface {
    $storage = $this->entityTypeManager->getStorage('node');
    $ids = $storage->getQuery()
      ->accessCheck(TRUE)
      ->condition('type', 'card')
      ->condition('status', 1)
      ->condition('field_set.entity.field_set_code', $setCode)
      ->condition('field_collector_number', $number)
      ->range(0, 5)
      ->execute();

    if (!$ids) {
      return NULL;
    }

    $current = $this->languageManager->getCurrentLanguage()->getId();
    $first = NULL;
    foreach ($storage->loadMultiple($ids) as $node) {
      /** @var \Drupal\node\NodeInterface $node */
      $node = $node->hasTranslation($current) ? $node->getTranslation($current) : $node;
      $first ??= $node;
      if ($node->language()->getId() === $current) {
        return $node;
      }
    }

    return $first;
  }

  /**
   * {@inheritdoc}
   */
  public function tips($long = FALSE): string {
    if ($long) {
      return (string) $this->t('Link a card by typing its token, e.g. <code>[card:1/207]</code> (set code / collector number). Add a name hint after a hyphen if you like — <code>[card:1/207-elsa]</code> — it is ignored when matching. Unknown cards are left visible so you can fix the token.');
    }
    return (string) $this->t('Reference a card with <code>[card:1/207]</code> (set / number).');
  }

}
