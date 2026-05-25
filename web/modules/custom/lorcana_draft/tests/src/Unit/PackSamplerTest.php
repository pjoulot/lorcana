<?php

declare(strict_types=1);

namespace Drupal\Tests\lorcana_draft\Unit;

use Drupal\lorcana_draft\Random\PackSampler;
use Drupal\lorcana_draft\Random\SeededRandom;
use Drupal\Tests\UnitTestCase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Group;

/**
 * Unit-tests the deterministic booster-pack sampler.
 */
#[CoversClass(PackSampler::class)]
#[CoversClass(SeededRandom::class)]
#[Group('lorcana_draft')]
final class PackSamplerTest extends UnitTestCase {

  /**
   * A synthetic pool with enough of each rarity to fill a pack cleanly.
   *
   * Commons (8) are fewer than 6 × 4 packs = 24, so they must recur across
   * packs — which exercises with-replacement-across-packs.
   *
   * @return array<string, array<int, array{id: int, rarity: string}>>
   *   Card stubs grouped by rarity.
   */
  private function pool(): array {
    $make = static function (string $rarity, int $from, int $count): array {
      $cards = [];
      for ($i = 0; $i < $count; $i++) {
        $cards[] = ['id' => $from + $i, 'rarity' => $rarity];
      }
      return $cards;
    };

    return [
      'common' => $make('common', 100, 8),
      'uncommon' => $make('uncommon', 200, 5),
      'rare' => $make('rare', 300, 4),
      'super_rare' => $make('super_rare', 400, 3),
      'legendary' => $make('legendary', 500, 2),
      'enchanted' => $make('enchanted', 600, 2),
    ];
  }

  /**
   * The default distribution yields 12-card packs with the right slot shape.
   */
  public function testDefaultPackShape(): void {
    $sampler = new PackSampler();
    $result = $sampler->build($this->pool(), PackSampler::DEFAULT_DISTRIBUTION, 4, 1, 'seed-a');

    $packs = $result['packs'][0];
    $this->assertCount(4, $packs, 'Four packs for the single player.');

    foreach ($packs as $pack) {
      $this->assertCount(12, $pack, 'Each pack holds 12 cards.');

      $rarities = array_column($pack, 'rarity');
      // Slots: 6 common, 3 uncommon, 2 rare-tier (9-10), 1 foil (11).
      $this->assertSame(['common', 'common', 'common', 'common', 'common', 'common'], array_slice($rarities, 0, 6));
      $this->assertSame(['uncommon', 'uncommon', 'uncommon'], array_slice($rarities, 6, 3));
      $this->assertContains($rarities[9], ['rare', 'super_rare', 'legendary']);
      $this->assertContains($rarities[10], ['rare', 'super_rare', 'legendary']);

      // The last slot is the foil; the rest are not.
      $foils = array_column($pack, 'foil');
      $this->assertSame(array_fill(0, 11, FALSE), array_slice($foils, 0, 11));
      $this->assertTrue($pack[11]['foil']);

      // No card appears twice within a single pack (all 12 ids distinct).
      $ids = array_column($pack, 'id');
      $this->assertCount(12, array_unique($ids), 'No in-pack duplicates.');
    }
  }

  /**
   * The same seed reproduces the same packs; a different seed differs.
   */
  public function testDeterminism(): void {
    $sampler = new PackSampler();
    $dist = PackSampler::DEFAULT_DISTRIBUTION;

    $a = $sampler->build($this->pool(), $dist, 4, 1, 'seed-a');
    $b = $sampler->build($this->pool(), $dist, 4, 1, 'seed-a');
    $c = $sampler->build($this->pool(), $dist, 4, 1, 'seed-b');

    $this->assertSame($a['packs'], $b['packs'], 'Same seed ⇒ identical packs.');
    $this->assertNotSame($a['packs'], $c['packs'], 'Different seed ⇒ different packs.');
  }

  /**
   * Commons recur across packs (with-replacement across packs).
   */
  public function testCrossPackReuse(): void {
    $sampler = new PackSampler();
    $result = $sampler->build($this->pool(), PackSampler::DEFAULT_DISTRIBUTION, 4, 1, 'seed-a');

    $commonIds = [];
    foreach ($result['packs'][0] as $pack) {
      foreach ($pack as $card) {
        if ($card['rarity'] === 'common') {
          $commonIds[] = $card['id'];
        }
      }
    }

    // At least 24 commons (6 per pack × 4; the foil slot can add more) drawn
    // from only 8 distinct commons ⇒ reuse across packs is forced.
    $this->assertGreaterThanOrEqual(24, count($commonIds));
    $this->assertLessThan(count($commonIds), count(array_unique($commonIds)));
  }

  /**
   * The PRNG is reproducible and stays in range.
   */
  public function testSeededRandom(): void {
    $first = [];
    $rng = new SeededRandom('x');
    for ($i = 0; $i < 5; $i++) {
      $v = $rng->next();
      $this->assertGreaterThanOrEqual(0.0, $v);
      $this->assertLessThan(1.0, $v);
      $first[] = $v;
    }

    $rng2 = new SeededRandom('x');
    $second = [];
    for ($i = 0; $i < 5; $i++) {
      $second[] = $rng2->next();
    }

    $this->assertSame($first, $second, 'Same seed ⇒ same sequence.');
  }

}
