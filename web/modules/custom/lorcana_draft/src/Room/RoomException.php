<?php

declare(strict_types=1);

namespace Drupal\lorcana_draft\Room;

/**
 * Thrown when a room operation fails (missing, full, locked, not host, …).
 *
 * Join-time failures deliberately surface to the client as an identical 404
 * so codes can't be enumerated (spec 05); the $reason aids logging only.
 */
final class RoomException extends \RuntimeException {

  public function __construct(
    public readonly string $reason,
    public readonly int $status = 404,
  ) {
    parent::__construct($reason);
  }

}
