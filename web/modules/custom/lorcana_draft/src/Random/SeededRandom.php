<?php

declare(strict_types=1);

namespace Drupal\lorcana_draft\Random;

/**
 * A tiny deterministic PRNG (xorshift32).
 *
 * The draft's pack generation must be reproducible: the same seed produces
 * the same packs every time (spec 05 — auditability). PHP's mt_rand() is
 * process-global and awkward to test, so we carry our own seeded stream.
 *
 * 32-bit arithmetic is emulated with explicit masking, which is exact on the
 * 64-bit PHP the site runs on.
 */
final class SeededRandom {

  private const MASK = 0xFFFFFFFF;

  /**
   * Current 32-bit state; never zero (xorshift would stick at zero).
   */
  private int $state;

  public function __construct(string $seed) {
    // Derive a stable 32-bit, non-zero state from an arbitrary seed string.
    $this->state = (hexdec(substr(hash('sha256', $seed), 0, 8)) & self::MASK) ?: 1;
  }

  /**
   * Advances the stream and returns a float in [0, 1).
   */
  public function next(): float {
    $x = $this->state;
    $x ^= ($x << 13) & self::MASK;
    $x ^= ($x >> 17);
    $x ^= ($x << 5) & self::MASK;
    $this->state = $x & self::MASK;

    return $this->state / (self::MASK + 1);
  }

  /**
   * Returns an integer in [0, $maxExclusive).
   */
  public function nextInt(int $maxExclusive): int {
    if ($maxExclusive <= 0) {
      return 0;
    }

    return (int) floor($this->next() * $maxExclusive);
  }

}
