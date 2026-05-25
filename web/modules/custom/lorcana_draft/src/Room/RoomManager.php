<?php

declare(strict_types=1);

namespace Drupal\lorcana_draft\Room;

/**
 * Creates and mutates draft rooms.
 *
 * Rooms are private: the only way in is the shared code. Player credentials
 * (a per-player token) authenticate host-only actions and, later, peer
 * identity; tokens never leak in the public room view sent to clients.
 */
final class RoomManager {

  /**
   * Code alphabet: A–Z minus the easily-confused I and O.
   */
  private const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  private const CODE_LENGTH = 6;
  private const MAX_PLAYERS = 8;

  public function __construct(
    private readonly RoomStore $store,
  ) {}

  /**
   * Creates a room with the caller as host.
   *
   * @return array{code: string, playerId: string, token: string, room: array<string, mixed>}
   *   The new room's code, the host's credentials, and the public room view.
   */
  public function createRoom(string $set, int $packs, int $playerCount, string $pseudonym): array {
    $code = $this->generateCode();
    $hostId = $this->makePlayerId();
    $token = $this->makeToken();

    $room = [
      'code' => $code,
      'set' => $set,
      'packs' => max(1, min(8, $packs)),
      'playerCount' => max(2, min(self::MAX_PLAYERS, $playerCount)),
      'state' => 'lobby',
      'locked' => FALSE,
      'hostId' => $hostId,
      'createdAt' => time(),
      'players' => [
        $hostId => [
          'id' => $hostId,
          'pseudonym' => $this->cleanPseudonym($pseudonym),
          'host' => TRUE,
          'token' => $token,
          'joinedAt' => time(),
        ],
      ],
    ];
    $this->store->saveRoom($room);

    return ['code' => $code, 'playerId' => $hostId, 'token' => $token, 'room' => $this->publicRoom($room)];
  }

  /**
   * Adds a player to a lobby.
   *
   * @return array{playerId: string, token: string, room: array<string, mixed>}
   *   The joiner's credentials and the public room view.
   *
   * @throws \Drupal\lorcana_draft\Room\RoomException
   *   With an opaque 404 when the room is missing, started, locked, or full.
   */
  public function joinRoom(string $code, string $pseudonym): array {
    $room = $this->store->getRoom($code);
    if ($room === NULL) {
      throw new RoomException('not_found');
    }
    if ($room['state'] !== 'lobby') {
      throw new RoomException('started');
    }
    if (!empty($room['locked'])) {
      throw new RoomException('locked');
    }
    if (count($room['players']) >= $room['playerCount']) {
      throw new RoomException('full');
    }

    $playerId = $this->makePlayerId();
    $token = $this->makeToken();
    $room['players'][$playerId] = [
      'id' => $playerId,
      'pseudonym' => $this->cleanPseudonym($pseudonym),
      'host' => FALSE,
      'token' => $token,
      'joinedAt' => time(),
    ];
    $this->store->saveRoom($room);

    return ['playerId' => $playerId, 'token' => $token, 'room' => $this->publicRoom($room)];
  }

  /**
   * Returns a room's public view, or NULL if unknown.
   *
   * @return array<string, mixed>|null
   *   The token-free room view.
   */
  public function getPublicRoom(string $code): ?array {
    $room = $this->store->getRoom($code);
    return $room ? $this->publicRoom($room) : NULL;
  }

  /**
   * Marks a room active. Host only; needs at least two players.
   *
   * @return array<string, mixed>
   *   The public room view.
   *
   * @throws \Drupal\lorcana_draft\Room\RoomException
   *   When the caller is not the host or the room can't start.
   */
  public function startRoom(string $code, string $playerId, string $token): array {
    $room = $this->requireAuth($code, $playerId, $token);
    if ($room['hostId'] !== $playerId) {
      throw new RoomException('not_host', 403);
    }
    if ($room['state'] !== 'lobby') {
      throw new RoomException('already_started', 409);
    }
    if (count($room['players']) < 2) {
      throw new RoomException('need_players', 409);
    }
    $room['state'] = 'active';
    $room['startedAt'] = time();
    $this->store->saveRoom($room);

    return $this->publicRoom($room);
  }

  /**
   * Loads a room and verifies the caller's credentials.
   *
   * @return array<string, mixed>
   *   The raw (token-bearing) room state.
   *
   * @throws \Drupal\lorcana_draft\Room\RoomException
   *   When the room is unknown or the token doesn't match the player.
   */
  public function requireAuth(string $code, string $playerId, string $token): array {
    $room = $this->store->getRoom($code);
    if ($room === NULL) {
      throw new RoomException('not_found');
    }
    $player = $room['players'][$playerId] ?? NULL;
    if ($player === NULL || !hash_equals((string) $player['token'], $token)) {
      throw new RoomException('forbidden', 403);
    }
    return $room;
  }

  /**
   * Strips tokens and re-keys players as a list for the client.
   *
   * @param array<string, mixed> $room
   *   Raw room state.
   *
   * @return array<string, mixed>
   *   The public room view.
   */
  private function publicRoom(array $room): array {
    $players = [];
    foreach ($room['players'] as $player) {
      $players[] = [
        'id' => $player['id'],
        'pseudonym' => $player['pseudonym'],
        'host' => $player['host'],
      ];
    }
    return [
      'code' => $room['code'],
      'set' => $room['set'],
      'packs' => $room['packs'],
      'playerCount' => $room['playerCount'],
      'state' => $room['state'],
      'locked' => $room['locked'],
      'hostId' => $room['hostId'],
      'players' => $players,
    ];
  }

  /**
   * Generates an unused room code.
   */
  private function generateCode(): string {
    do {
      $code = '';
      for ($i = 0; $i < self::CODE_LENGTH; $i++) {
        $code .= self::ALPHABET[random_int(0, strlen(self::ALPHABET) - 1)];
      }
    } while ($this->store->codeExists($code));
    return $code;
  }

  /**
   * Generates an opaque player id.
   */
  private function makePlayerId(): string {
    return 'p_' . bin2hex(random_bytes(5));
  }

  /**
   * Generates a per-player secret token.
   */
  private function makeToken(): string {
    return bin2hex(random_bytes(16));
  }

  /**
   * Normalises a pseudonym: trims, strips control chars, caps length.
   */
  private function cleanPseudonym(string $pseudonym): string {
    $clean = preg_replace('/[\x00-\x1F\x7F]/u', '', trim($pseudonym)) ?? '';
    $clean = mb_substr($clean, 0, 24);
    return $clean !== '' ? $clean : 'Player';
  }

}
