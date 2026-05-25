<?php

declare(strict_types=1);

namespace Drupal\lorcana_draft\Controller;

use Drupal\Component\Serialization\Json;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Entity\EntityRepositoryInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Language\LanguageInterface;
use Drupal\Core\Language\LanguageManagerInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\lorcana_draft\Service\PackGenerator;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * Serves the embedded draft-simulator single-page app.
 *
 * Phase 3a hosts a client-side-only "solo dry run": the page renders a
 * mount point plus the list of draftable sets, and the React bundle drives
 * the whole flow. The deterministic pack generation it calls is added in a
 * later commit (POST /api/draft/solo).
 */
final class DraftController implements ContainerInjectionInterface {

  use StringTranslationTrait;

  public function __construct(
    private readonly EntityTypeManagerInterface $entityTypeManager,
    private readonly EntityRepositoryInterface $entityRepository,
    private readonly LanguageManagerInterface $languageManager,
    private readonly PackGenerator $packGenerator,
  ) {}

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container): self {
    return new self(
      $container->get('entity_type.manager'),
      $container->get('entity.repository'),
      $container->get('language_manager'),
      $container->get('lorcana_draft.pack_generator'),
    );
  }

  /**
   * Renders the SPA shell for every /draft screen.
   */
  public function app(): array {
    $build = [
      'app' => [
        '#type' => 'html_tag',
        '#tag' => 'div',
        '#attributes' => ['id' => 'lorcana-draft-app'],
        // A no-JS fallback, replaced once the bundle mounts.
        'noscript' => [
          '#type' => 'html_tag',
          '#tag' => 'noscript',
          '#value' => $this->t('The draft simulator needs JavaScript enabled.'),
        ],
      ],
      '#attached' => [
        'library' => ['lorcana_draft/app'],
        'drupalSettings' => [
          'lorcanaDraft' => [
            'sets' => $this->draftableSets(),
            'soloEndpoint' => '/api/draft/solo',
          ],
        ],
        // These pages are ephemeral and user-specific — keep them out of
        // search indexes and the sitemap (spec 05: SEO directives).
        'html_head' => [
          [
            [
              '#tag' => 'meta',
              '#attributes' => [
                'name' => 'robots',
                'content' => 'noindex, nofollow',
              ],
            ],
            'lorcana_draft_noindex',
          ],
        ],
      ],
      // The set list varies by content language and by which sets are
      // flagged draftable, so vary on language and bust on card_set saves.
      '#cache' => [
        'contexts' => ['languages:language_content'],
        'tags' => ['node_list:card_set'],
      ],
    ];

    return $build;
  }

  /**
   * Generates a solo dry-run draft: all packs for a single player.
   *
   * Stateless — nothing is stored server-side. The browser runs the pick
   * loop over the returned packs (spec 05, phase 3a).
   */
  public function solo(Request $request): JsonResponse {
    $data = Json::decode($request->getContent()) ?: [];
    $code = (string) ($data['set'] ?? '');
    $packs = max(1, min(8, (int) ($data['packs'] ?? 4)));

    if ($code === '' || !$this->isDraftable($code)) {
      return new JsonResponse(['error' => 'unknown_set'], 404);
    }

    $langcode = $this->languageManager->getCurrentLanguage(LanguageInterface::TYPE_CONTENT)->getId();
    $result = $this->packGenerator->generate($code, $packs, 1, NULL, $langcode);

    if (($result['packs'][0] ?? []) === []) {
      return new JsonResponse(['error' => 'empty_pool'], 409);
    }

    return new JsonResponse([
      'seed' => $result['seed'],
      'set' => $result['set'],
      'packs' => $result['packs'][0],
    ]);
  }

  /**
   * Whether a set code maps to a published, draftable set.
   */
  private function isDraftable(string $setCode): bool {
    $ids = $this->entityTypeManager->getStorage('node')->getQuery()
      ->accessCheck(TRUE)
      ->condition('type', 'card_set')
      ->condition('status', 1)
      ->condition('field_is_draftable', 1)
      ->condition('field_set_code', $setCode)
      ->range(0, 1)
      ->execute();

    return $ids !== [];
  }

  /**
   * Returns the draftable sets as plain data for drupalSettings.
   *
   * @return array<int, array{code: string, name: string, cards: int}>
   *   One entry per draftable set, ordered newest first.
   */
  private function draftableSets(): array {
    $storage = $this->entityTypeManager->getStorage('node');
    $ids = $storage->getQuery()
      ->accessCheck(TRUE)
      ->condition('type', 'card_set')
      ->condition('status', 1)
      ->condition('field_is_draftable', 1)
      ->sort('field_released_at', 'DESC')
      ->execute();

    $sets = [];
    foreach ($storage->loadMultiple($ids) as $node) {
      $node = $this->entityRepository->getTranslationFromContext($node);
      $sets[] = [
        'code' => (string) $node->get('field_set_code')->value,
        'name' => (string) $node->label(),
        'cards' => (int) ($node->get('field_card_count')->value ?? 0),
      ];
    }

    return $sets;
  }

}
