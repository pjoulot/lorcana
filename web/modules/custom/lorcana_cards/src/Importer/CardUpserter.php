<?php

declare(strict_types=1);

namespace Drupal\lorcana_cards\Importer;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\File\FileExists;
use Drupal\Core\File\FileSystemInterface;
use Drupal\Core\Logger\LoggerChannelFactoryInterface;
use Drupal\Core\Logger\LoggerChannelInterface;
use Drupal\file\FileRepositoryInterface;
use Drupal\node\Entity\Node;
use Drupal\node\NodeInterface;
use Drupal\taxonomy\Entity\Term;
use Drupal\taxonomy\TermInterface;

/**
 * Writes CardData / SetSummary objects into Drupal nodes.
 *
 * Identity rules per spec 2:
 *  - card_set: looked up by lorcast_id, fallback by field_set_code.
 *  - card: looked up by lorcast_id, fallback by (set_code, collector_number,
 *    langcode). Each (printing, language) is its own node.
 */
final class CardUpserter {

  private const STATS_KEYS = ['sets_created', 'sets_updated', 'cards_created', 'cards_updated', 'cards_failed', 'images_attached', 'images_failed'];

  private array $stats;

  private LoggerChannelInterface $logger;

  public function __construct(
    private readonly EntityTypeManagerInterface $entityTypeManager,
    LoggerChannelFactoryInterface $loggerFactory,
    private readonly FileRepositoryInterface $fileRepository,
    private readonly FileSystemInterface $fileSystem,
  ) {
    $this->logger = $loggerFactory->get('lorcana_cards');
    $this->resetStats();
  }

  public function resetStats(): void {
    $this->stats = array_fill_keys(self::STATS_KEYS, 0);
  }

  public function getStats(): array {
    return $this->stats;
  }

  public function upsertSet(SetSummary $set): NodeInterface {
    $nodeStorage = $this->entityTypeManager->getStorage('node');
    $existing = $nodeStorage->loadByProperties([
      'type' => 'card_set',
      'field_set_code' => $set->code,
    ]);
    $node = $existing ? reset($existing) : NULL;

    $created = $node === NULL;
    if ($created) {
      $node = Node::create([
        'type' => 'card_set',
        'langcode' => 'en',
        'title' => $set->name,
        'field_set_code' => $set->code,
      ]);
    }
    else {
      $node->setTitle($set->name);
    }

    $node->set('field_lorcast_id', $set->sourceId);
    $node->set('field_released_at', $set->releasedAt);
    $node->set('field_prereleased_at', $set->prereleasedAt);

    if ($node->get('field_is_draftable')->isEmpty()) {
      $node->set('field_is_draftable', FALSE);
    }

    $node->save();
    $this->stats[$created ? 'sets_created' : 'sets_updated']++;
    return $node;
  }

  public function upsertCard(CardData $card, ?CardImageImporterInterface $imagePlugin = NULL): ?NodeInterface {
    try {
      $set = $this->resolveSetNode($card);
      $node = $this->resolveCardNode($card);
      $created = $node === NULL;

      $title = $card->name . ($card->version !== NULL && $card->version !== '' ? ' — ' . $card->version : '');

      if ($created) {
        $node = Node::create([
          'type' => 'card',
          'langcode' => $card->language,
          'title' => $title,
        ]);
      }
      else {
        $node->setTitle($title);
      }

      $node->set('field_lorcast_id', $card->lorcastId);
      $node->set('field_set', ['target_id' => $set->id()]);
      $node->set('field_collector_number', $card->collectorNumber);
      $node->set('field_version', $card->version);
      $node->set('field_layout', $card->layout);
      $node->set('field_cost', $card->cost);
      $node->set('field_inkable', $card->inkable);
      $node->set('field_ink', $this->resolveInkTerm($card->ink));
      $node->set('field_card_types', $card->cardTypes);
      $node->set('field_classifications', $this->resolveClassificationTerms($card->classifications));
      $node->set('field_character', $this->resolveCharacterTerm($card));
      $node->set('field_strength', $card->strength);
      $node->set('field_willpower', $card->willpower);
      $node->set('field_lore', $card->lore);
      $node->set('field_move_cost', $card->moveCost);
      $node->set('field_text', $card->text);
      $node->set('field_flavor_text', $card->flavorText);
      $node->set('field_keywords', $this->resolveKeywordTerms($card->keywords));
      $node->set('field_rarity', $card->rarity);
      $node->set('field_illustrators', $card->illustrators);
      $node->set('field_tcgplayer_id', $card->tcgplayerId);
      $node->set('field_legal_core', $card->legalCore);
      $node->set('field_price_usd', $card->priceUsd);
      $node->set('field_price_usd_foil', $card->priceUsdFoil);
      $node->set('field_released_at', $card->releasedAt);
      $node->set('field_last_imported', \Drupal::time()->getRequestTime());
      $node->set('field_import_source', $card->sourceId);
      $node->set('field_printing_group_id', $card->printingGroupId);

      if ($node->get('field_is_primary_printing')->isEmpty()) {
        // Default primaries to the standard (non-Enchanted) printing. The
        // import:all command can re-flag primaries across a printing group in
        // a follow-up pass.
        $node->set('field_is_primary_printing', !in_array($card->rarity, ['enchanted', 'special'], TRUE));
      }

      $node->save();
      $this->stats[$created ? 'cards_created' : 'cards_updated']++;

      if ($imagePlugin !== NULL && !$node->get('field_is_image_manual_override')->value && $imagePlugin->supports($card)) {
        $this->attachCardArt($node, $card, $imagePlugin);
      }

      return $node;
    }
    catch (\Throwable $e) {
      $this->stats['cards_failed']++;
      $this->logger->error('Failed to upsert card @lorcast_id: @msg', [
        '@lorcast_id' => $card->lorcastId,
        '@msg' => $e->getMessage(),
      ]);
      return NULL;
    }
  }

  private function attachCardArt(NodeInterface $card, CardData $cardData, CardImageImporterInterface $imagePlugin): void {
    $destDir = 'public://cards/' . $cardData->setCode . '/' . $cardData->language;
    if (!$this->fileSystem->prepareDirectory($destDir, FileSystemInterface::CREATE_DIRECTORY | FileSystemInterface::MODIFY_PERMISSIONS)) {
      $this->logger->error('Cannot prepare image directory @dir for card @id.', [
        '@dir' => $destDir,
        '@id' => $cardData->lorcastId,
      ]);
      return;
    }

    $localPath = $imagePlugin->fetchImage($cardData);
    if ($localPath === NULL) {
      $this->stats['images_failed']++;
      return;
    }

    try {
      $contents = file_get_contents($localPath);
      $dest = $destDir . '/' . $cardData->collectorNumber . '.jpg';
      $file = $this->fileRepository->writeData((string) $contents, $dest, FileExists::Replace);
      $altText = $card->getTitle();

      // Reuse an existing Media (bundle: image) if one already points at this
      // file URI — keeps re-imports from accumulating duplicate Media entities.
      $mediaStorage = $this->entityTypeManager->getStorage('media');
      $existingMedia = $mediaStorage->loadByProperties([
        'bundle' => 'image',
        'field_media_image.target_id' => $file->id(),
      ]);
      if ($existingMedia) {
        $media = reset($existingMedia);
        $media->setName($card->getTitle());
        $media->set('field_media_image', [
          'target_id' => $file->id(),
          'alt' => $altText,
        ]);
      }
      else {
        $media = $mediaStorage->create([
          'bundle' => 'image',
          'name' => $card->getTitle(),
          'langcode' => $card->language()->getId(),
          'uid' => 1,
          'status' => TRUE,
          'field_media_image' => [
            'target_id' => $file->id(),
            'alt' => $altText,
          ],
        ]);
      }
      $media->save();

      $card->set('field_card_art', ['target_id' => $media->id()]);
      $card->set('field_image_source', $imagePlugin->getId());
      $card->save();
      $this->stats['images_attached']++;
    }
    catch (\Throwable $e) {
      $this->stats['images_failed']++;
      $this->logger->error('Failed to attach card art to @id: @msg', [
        '@id' => $cardData->lorcastId,
        '@msg' => $e->getMessage(),
      ]);
    }
    finally {
      if (file_exists($localPath)) {
        @unlink($localPath);
      }
    }
  }

  private function resolveSetNode(CardData $card): NodeInterface {
    $nodeStorage = $this->entityTypeManager->getStorage('node');
    $existing = $nodeStorage->loadByProperties([
      'type' => 'card_set',
      'field_set_code' => $card->setCode,
    ]);
    if ($existing) {
      return reset($existing);
    }
    // The card import was given a code we don't have a set node for. Build a
    // minimal stub from the source fields and let upsertSet fill it later.
    $stub = Node::create([
      'type' => 'card_set',
      'langcode' => 'en',
      'title' => $card->sourceFields['set']['name'] ?? $card->setCode,
      'field_set_code' => $card->setCode,
      'field_lorcast_id' => $card->sourceFields['set']['id'] ?? NULL,
      'field_is_draftable' => FALSE,
    ]);
    $stub->save();
    $this->stats['sets_created']++;
    return $stub;
  }

  private function resolveCardNode(CardData $card): ?NodeInterface {
    $nodeStorage = $this->entityTypeManager->getStorage('node');
    $byLorcastId = $nodeStorage->loadByProperties([
      'type' => 'card',
      'field_lorcast_id' => $card->lorcastId,
    ]);
    if ($byLorcastId) {
      return reset($byLorcastId);
    }
    $byNaturalKey = $nodeStorage->loadByProperties([
      'type' => 'card',
      'field_collector_number' => $card->collectorNumber,
      'langcode' => $card->language,
    ]);
    foreach ($byNaturalKey as $node) {
      $setRef = $node->get('field_set')->entity;
      if ($setRef && $setRef->get('field_set_code')->value === $card->setCode) {
        return $node;
      }
    }
    return NULL;
  }

  private function resolveCharacterTerm(CardData $card): ?array {
    // Only Character cards depict a single named Disney character — Songs and
    // Actions put song / action names in the `name` field and don't map 1:1.
    if (!in_array('character', $card->cardTypes, TRUE)) {
      return NULL;
    }
    if ($card->name === '') {
      return NULL;
    }
    $term = $this->findOrCreateTerm('disney_character', $card->name);
    return ['target_id' => $term->id()];
  }

  private function resolveInkTerm(?string $inkLabel): ?array {
    if ($inkLabel === NULL || $inkLabel === '') {
      return NULL;
    }
    $term = $this->findOrCreateTerm('ink_color', $inkLabel);
    return ['target_id' => $term->id()];
  }

  /**
   * @param string[] $labels
   * @return array<int,array{target_id:int}>
   */
  private function resolveClassificationTerms(array $labels): array {
    $refs = [];
    foreach ($labels as $label) {
      if (!is_string($label) || trim($label) === '') {
        continue;
      }
      $term = $this->findOrCreateTerm('card_classification', $label);
      $refs[] = ['target_id' => $term->id()];
    }
    return $refs;
  }

  /**
   * @param string[] $labels
   * @return array<int,array{target_id:int}>
   */
  private function resolveKeywordTerms(array $labels): array {
    $refs = [];
    foreach ($labels as $label) {
      if (!is_string($label) || trim($label) === '') {
        continue;
      }
      $term = $this->findOrCreateTerm('keyword_ability', $label, [
        'field_machine_name' => strtolower(preg_replace('/[^a-z0-9]+/i', '_', trim($label))),
        'field_parameterized' => FALSE,
        'field_parameter_kind' => 'none',
      ]);
      $refs[] = ['target_id' => $term->id()];
    }
    return $refs;
  }

  /**
   * @param array<string,mixed> $extraValues
   */
  private function findOrCreateTerm(string $vid, string $label, array $extraValues = []): TermInterface {
    $termStorage = $this->entityTypeManager->getStorage('taxonomy_term');
    $existing = $termStorage->loadByProperties([
      'vid' => $vid,
      'name' => $label,
    ]);
    if ($existing) {
      return reset($existing);
    }
    $term = Term::create([
      'vid' => $vid,
      'name' => $label,
      'langcode' => 'en',
    ] + $extraValues);
    $term->save();
    return $term;
  }

}
