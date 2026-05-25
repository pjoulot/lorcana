<?php

declare(strict_types=1);

namespace Drupal\lorcana_draft\Controller;

use Drupal\Component\Serialization\Json;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\lorcana_draft\Room\RoomException;
use Drupal\lorcana_draft\Room\RoomManager;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * HTTP API for draft rooms (create / join / state / start).
 *
 * All endpoints are anonymous and JSON. Join failures collapse to an opaque
 * 404 so room codes can't be enumerated (spec 05).
 */
final class RoomController implements ContainerInjectionInterface {

  public function __construct(
    private readonly RoomManager $rooms,
    private readonly EntityTypeManagerInterface $entityTypeManager,
  ) {}

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container): self {
    return new self(
      $container->get('lorcana_draft.room_manager'),
      $container->get('entity_type.manager'),
    );
  }

  /**
   * POST /api/draft/room — create a room as host.
   */
  public function createRoom(Request $request): JsonResponse {
    $data = $this->body($request);
    $set = (string) ($data['set'] ?? '');
    if ($set === '' || !$this->isDraftable($set)) {
      return new JsonResponse(['error' => 'unknown_set'], 404);
    }
    $result = $this->rooms->createRoom(
      $set,
      (int) ($data['packs'] ?? 4),
      (int) ($data['players'] ?? 4),
      (string) ($data['pseudonym'] ?? ''),
    );
    return new JsonResponse($result);
  }

  /**
   * POST /api/draft/room/{code}/join — join a lobby.
   */
  public function joinRoom(string $code, Request $request): JsonResponse {
    $data = $this->body($request);
    try {
      $result = $this->rooms->joinRoom(strtoupper($code), (string) ($data['pseudonym'] ?? ''));
      return new JsonResponse($result);
    }
    catch (RoomException) {
      // Opaque: wrong / full / locked / started / missing all read the same.
      return new JsonResponse(['error' => 'not_found'], 404);
    }
  }

  /**
   * GET /api/draft/room/{code} — current public room state (lobby polling).
   */
  public function getRoom(string $code): JsonResponse {
    $room = $this->rooms->getPublicRoom(strtoupper($code));
    if ($room === NULL) {
      return new JsonResponse(['error' => 'not_found'], 404);
    }
    return new JsonResponse(['room' => $room], 200, ['Cache-Control' => 'no-store']);
  }

  /**
   * POST /api/draft/room/{code}/start — host starts the draft.
   */
  public function startRoom(string $code, Request $request): JsonResponse {
    $data = $this->body($request);
    try {
      $room = $this->rooms->startRoom(
        strtoupper($code),
        (string) ($data['playerId'] ?? ''),
        (string) ($data['token'] ?? ''),
      );
      return new JsonResponse(['room' => $room]);
    }
    catch (RoomException $e) {
      return new JsonResponse(['error' => $e->reason], $e->status);
    }
  }

  /**
   * POST /api/draft/room/{code}/signal — queue an envelope for a peer.
   */
  public function signalSend(string $code, Request $request): JsonResponse {
    $data = $this->body($request);
    try {
      $this->rooms->sendSignal(
        strtoupper($code),
        (string) ($data['playerId'] ?? ''),
        (string) ($data['token'] ?? ''),
        (string) ($data['to'] ?? ''),
        is_array($data['payload'] ?? NULL) ? $data['payload'] : [],
      );
      return new JsonResponse(['ok' => TRUE]);
    }
    catch (RoomException $e) {
      return new JsonResponse(['error' => $e->reason], $e->status);
    }
  }

  /**
   * GET /api/draft/room/{code}/signal — drain envelopes for the caller.
   */
  public function signalReceive(string $code, Request $request): JsonResponse {
    try {
      $messages = $this->rooms->receiveSignals(
        strtoupper($code),
        (string) $request->query->get('playerId', ''),
        (string) $request->query->get('token', ''),
      );
      return new JsonResponse(['messages' => $messages], 200, ['Cache-Control' => 'no-store']);
    }
    catch (RoomException $e) {
      return new JsonResponse(['error' => $e->reason], $e->status);
    }
  }

  /**
   * Decodes the JSON request body.
   *
   * @return array<string, mixed>
   *   The decoded body, or an empty array.
   */
  private function body(Request $request): array {
    $data = Json::decode($request->getContent());
    return is_array($data) ? $data : [];
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

}
