<?php

declare(strict_types=1);

namespace Drupal\lorcana_draft\Service;

use Drupal\Component\Serialization\Json;
use Drupal\lorcana_cards\Service\PackPoolProvider;
use Drupal\lorcana_draft\Random\PackSampler;
use Drupal\node\NodeInterface;

/**
 * Generates booster packs for a draft, deterministically.
 *
 * Wires the set's card pool and pack-distribution to the pure
 * {@see \Drupal\lorcana_draft\Random\PackSampler}. Card art is resolved only
 * for the cards actually drawn, not the whole ~200-card pool.
 */
final class PackGenerator {

  public function __construct(
    private readonly PackPoolProvider $packPool,
    private readonly PackSampler $sampler,
  ) {}

  /**
   * Generates each player's packs for a set.
   *
   * @param string $setCode
   *   The set's field_set_code.
   * @param int $packs
   *   Packs per player.
   * @param int $players
   *   Number of players (1 for the solo dry run).
   * @param string|null $seed
   *   Seed for reproducibility; a random one is used when omitted.
   * @param string $langcode
   *   Language of the card pool.
   *
   * @return array{seed: string, set: string, packs: array<int, array<int, array<int, array<string, mixed>>>>}
   *   The seed, set code, and packs[player][pack][card]. Empty packs when the
   *   set is unknown or has no cards.
   */
  public function generate(string $setCode, int $packs, int $players = 1, ?string $seed = NULL, string $langcode = 'en'): array {
    $seed = $seed ?? bin2hex(random_bytes(6));

    // Index the pool by node id and build lightweight {id, rarity} stubs so
    // the sampler stays cheap; full payloads come later for drawn cards only.
    $nodesById = [];
    $stubPool = [];
    foreach ($this->packPool->getPool($setCode, $langcode) as $rarity => $nodes) {
      foreach ($nodes as $node) {
        assert($node instanceof NodeInterface);
        $id = (int) $node->id();
        $nodesById[$id] = $node;
        $stubPool[$rarity][] = ['id' => $id, 'rarity' => $rarity];
      }
    }

    $sampled = $this->sampler->build(
      $stubPool,
      $this->distributionFor($setCode),
      $packs,
      $players,
      $setCode . ':' . $seed,
    );

    $players_out = [];
    foreach ($sampled['packs'] as $playerPacks) {
      $packs_out = [];
      foreach ($playerPacks as $pack) {
        $cards = [];
        foreach ($pack as $stub) {
          $payload = $this->packPool->payload($nodesById[$stub['id']]);
          $payload['foil'] = (bool) ($stub['foil'] ?? FALSE);
          $cards[] = $payload;
        }
        $packs_out[] = $cards;
      }
      $players_out[] = $packs_out;
    }

    return ['seed' => $seed, 'set' => $setCode, 'packs' => $players_out];
  }

  /**
   * Returns a set's pack distribution, falling back to the default shape.
   *
   * The field stores a JSON object (pack_size + slots[]); when it's empty or
   * malformed we use {@see PackSampler::DEFAULT_DISTRIBUTION}.
   *
   * @param string $setCode
   *   The set's field_set_code.
   *
   * @return array<string, mixed>
   *   A distribution spec.
   */
  private function distributionFor(string $setCode): array {
    $set = $this->packPool->getSet($setCode);
    if ($set !== NULL) {
      $raw = trim((string) $set->get('field_pack_distribution')->value);
      if ($raw !== '') {
        $decoded = Json::decode($raw);
        if (is_array($decoded) && !empty($decoded['slots'])) {
          return $decoded;
        }
      }
    }

    return PackSampler::DEFAULT_DISTRIBUTION;
  }

}
