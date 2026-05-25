<?php

declare(strict_types=1);

namespace Drupal\lorcana_draft\Random;

/**
 * Deterministic booster-pack sampler — the pure heart of pack generation.
 *
 * Given a card pool grouped by rarity, a pack-distribution spec, and a seed,
 * it produces the same packs every time. It is intentionally free of Drupal
 * dependencies so the fairness/determinism logic can be unit-tested in
 * isolation; {@see \Drupal\lorcana_draft\Service\PackGenerator} wires it to
 * real card entities.
 *
 * Sampling rules (spec 05):
 *  - Within one pack: without replacement (no card appears twice).
 *  - Across packs: independent draws (a card may recur in another pack).
 */
final class PackSampler {

  /**
   * Default pack composition (spec 02) used when a set has no override.
   *
   * Rarity keys are the card field_rarity machine names. Sets with rarities
   * the default doesn't list (e.g. epic, iconic) simply won't surface those
   * cards until the distribution is calibrated.
   */
  public const DEFAULT_DISTRIBUTION = [
    'pack_size' => 12,
    'slots' => [
      ['count' => 6, 'rarities' => ['common']],
      ['count' => 3, 'rarities' => ['uncommon']],
      [
        'count' => 2,
        'rarities' => ['rare', 'super_rare', 'legendary'],
        'weights' => [0.70, 0.22, 0.08],
      ],
      [
        'count' => 1,
        'foil' => TRUE,
        'rarities' => ['common', 'uncommon', 'rare', 'super_rare', 'legendary', 'enchanted'],
        'weights' => [0.55, 0.30, 0.09, 0.02, 0.02, 0.02],
      ],
    ],
  ];

  /**
   * Builds every player's packs.
   *
   * @param array<string, array<int, array<string, mixed>>> $poolByRarity
   *   Card payloads grouped by rarity machine name. Each payload must carry a
   *   unique 'id'.
   * @param array<string, mixed> $distribution
   *   A pack-distribution spec (pack_size + slots[]).
   * @param int $packs
   *   Packs per player.
   * @param int $players
   *   Number of players (1 for the solo dry run).
   * @param string $seed
   *   Seed string; the same seed reproduces the same result.
   *
   * @return array{seed: string, packs: array<int, array<int, array<int, array<string, mixed>>>>}
   *   The seed plus packs[player][pack][card].
   */
  public function build(array $poolByRarity, array $distribution, int $packs, int $players, string $seed): array {
    $slots = $distribution['slots'] ?? self::DEFAULT_DISTRIBUTION['slots'];
    $rng = new SeededRandom($seed);

    $out = [];
    for ($player = 0; $player < $players; $player++) {
      $playerPacks = [];
      for ($p = 0; $p < $packs; $p++) {
        $playerPacks[] = $this->buildPack($slots, $poolByRarity, $rng);
      }
      $out[] = $playerPacks;
    }

    return ['seed' => $seed, 'packs' => $out];
  }

  /**
   * Builds one 12-card pack, slot by slot, with no in-pack duplicates.
   *
   * @param array<int, array<string, mixed>> $slots
   *   The distribution's slot list.
   * @param array<string, array<int, array<string, mixed>>> $poolByRarity
   *   Card payloads grouped by rarity.
   * @param \Drupal\lorcana_draft\Random\SeededRandom $rng
   *   The shared deterministic stream.
   *
   * @return array<int, array<string, mixed>>
   *   The pack's cards, each tagged with a 'foil' flag.
   */
  private function buildPack(array $slots, array $poolByRarity, SeededRandom $rng): array {
    $pack = [];
    $used = [];

    foreach ($slots as $slot) {
      $count = (int) ($slot['count'] ?? 1);
      $rarities = $slot['rarities'] ?? ['common'];
      $weights = $slot['weights'] ?? NULL;
      $foil = !empty($slot['foil']);

      for ($i = 0; $i < $count; $i++) {
        $card = $this->drawCard($rarities, $weights, $poolByRarity, $used, $rng);
        if ($card === NULL) {
          // The whole pool is exhausted for this pack; nothing left to add.
          continue;
        }
        $card['foil'] = $foil;
        $pack[] = $card;
        $used[$card['id']] = TRUE;
      }
    }

    return $pack;
  }

  /**
   * Draws one unused card, honouring the slot's rarity weights.
   *
   * Tries the weighted rarity first, then the slot's remaining rarities, then
   * any rarity in the pool — so a thin rarity (e.g. only 12 legendaries) never
   * leaves a slot empty.
   *
   * @param array<int, string> $rarities
   *   Candidate rarities for the slot.
   * @param array<int, float>|null $weights
   *   Per-rarity weights, or NULL for uniform.
   * @param array<string, array<int, array<string, mixed>>> $poolByRarity
   *   Card payloads grouped by rarity.
   * @param array<int|string, bool> $used
   *   Ids already placed in the current pack.
   * @param \Drupal\lorcana_draft\Random\SeededRandom $rng
   *   The shared deterministic stream.
   *
   * @return array<string, mixed>|null
   *   A card payload, or NULL if none remain anywhere.
   */
  private function drawCard(array $rarities, ?array $weights, array $poolByRarity, array $used, SeededRandom $rng): ?array {
    $order = $this->rarityOrder($rarities, $weights, $rng);
    // Append any remaining pool rarities as a last-resort fallback.
    foreach (array_keys($poolByRarity) as $rarity) {
      if (!in_array($rarity, $order, TRUE)) {
        $order[] = $rarity;
      }
    }

    foreach ($order as $rarity) {
      $available = array_values(array_filter(
        $poolByRarity[$rarity] ?? [],
        static fn(array $card): bool => empty($used[$card['id']]),
      ));
      if ($available !== []) {
        return $available[$rng->nextInt(count($available))];
      }
    }

    return NULL;
  }

  /**
   * Orders a slot's rarities: a weighted pick first, then the rest in order.
   *
   * @param array<int, string> $rarities
   *   Candidate rarities.
   * @param array<int, float>|null $weights
   *   Per-rarity weights, or NULL for uniform.
   * @param \Drupal\lorcana_draft\Random\SeededRandom $rng
   *   The shared deterministic stream.
   *
   * @return array<int, string>
   *   The rarities in the order to attempt.
   */
  private function rarityOrder(array $rarities, ?array $weights, SeededRandom $rng): array {
    if (count($rarities) === 1) {
      return $rarities;
    }

    $weights = $weights ?? array_fill(0, count($rarities), 1.0);
    $total = array_sum($weights) ?: 1.0;
    $roll = $rng->next() * $total;

    $chosen = 0;
    $acc = 0.0;
    foreach ($weights as $idx => $weight) {
      $acc += $weight;
      if ($roll < $acc) {
        $chosen = $idx;
        break;
      }
    }

    $order = [$rarities[$chosen]];
    foreach ($rarities as $idx => $rarity) {
      if ($idx !== $chosen) {
        $order[] = $rarity;
      }
    }

    return $order;
  }

}
