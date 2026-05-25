<?php

declare(strict_types=1);

namespace Drupal\lorcana_draft\Room;

use Drupal\Core\KeyValueStore\KeyValueExpirableFactoryInterface;
use Drupal\Core\KeyValueStore\KeyValueStoreExpirableInterface;

/**
 * Persists draft-room state with TTLs.
 *
 * Phase 3b is backed by the database-backed expirable key-value store — no
 * extra infrastructure. The interface is deliberately small (rooms + signal
 * queues) so it can be re-pointed at Redis (with true long-poll) when scale
 * demands it, exactly as spec 05 anticipates.
 */
final class RoomStore {

  private const ROOM_TTL = 7200;
  private const SIGNAL_TTL = 300;

  /**
   * The expirable key-value store backing all room data.
   */
  private readonly KeyValueStoreExpirableInterface $store;

  public function __construct(KeyValueExpirableFactoryInterface $factory) {
    $this->store = $factory->get('lorcana_draft');
  }

  /**
   * Loads a room, or NULL if it has expired / never existed.
   *
   * @return array<string, mixed>|null
   *   The stored room state.
   */
  public function getRoom(string $code): ?array {
    return $this->store->get('room.' . $code) ?: NULL;
  }

  /**
   * Writes a room, refreshing its TTL.
   *
   * @param array<string, mixed> $room
   *   Room state; must contain a 'code'.
   */
  public function saveRoom(array $room): void {
    $this->store->setWithExpire('room.' . $room['code'], $room, self::ROOM_TTL);
  }

  /**
   * Whether a code is currently in use.
   */
  public function codeExists(string $code): bool {
    return $this->store->has('room.' . $code);
  }

  /**
   * Appends a signalling envelope addressed to a peer.
   *
   * @param string $code
   *   The room code.
   * @param string $toPeer
   *   The recipient peer's player id.
   * @param array<string, mixed> $envelope
   *   The envelope ({from, payload, …}).
   */
  public function pushSignal(string $code, string $toPeer, array $envelope): void {
    $key = 'signal.' . $code . '.' . $toPeer;
    $queue = $this->store->get($key, []);
    $queue[] = $envelope;
    $this->store->setWithExpire($key, $queue, self::SIGNAL_TTL);
  }

  /**
   * Drains (reads and clears) the envelopes queued for a peer.
   *
   * @param string $code
   *   The room code.
   * @param string $peer
   *   The peer's player id.
   *
   * @return array<int, array<string, mixed>>
   *   The queued envelopes, oldest first.
   */
  public function drainSignals(string $code, string $peer): array {
    $key = 'signal.' . $code . '.' . $peer;
    $queue = $this->store->get($key, []);
    if ($queue !== []) {
      $this->store->delete($key);
    }
    return $queue;
  }

}
