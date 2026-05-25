// HTTP short-poll signalling client. Carries SDP offers/answers and ICE
// candidates between peers via the Drupal endpoints during room setup. Closed
// once the mesh is up. (Swappable for Redis long-poll later — spec 05.)

export interface SignalEnvelope {
  from: string;
  payload: SignalPayload;
}

// Non-trickle: ICE candidates are gathered into the SDP, so only offers and
// answers cross the wire — one message each per peer. This sidesteps races on
// the non-atomic DB signal queue that rapid candidate POSTs would cause.
export type SignalPayload =
  | { kind: 'offer'; sdp: string }
  | { kind: 'answer'; sdp: string };

export class SignalingClient {
  private timer: number | null = null;

  constructor(
    private readonly code: string,
    private readonly playerId: string,
    private readonly token: string,
  ) {}

  /**
   * Begins polling; invokes onEnvelope for each queued message, in order.
   */
  start(onEnvelope: (env: SignalEnvelope) => void): void {
    const url =
      `/api/draft/room/${encodeURIComponent(this.code)}/signal` +
      `?playerId=${encodeURIComponent(this.playerId)}&token=${encodeURIComponent(this.token)}`;
    const poll = async () => {
      try {
        const res = await fetch(url, { headers: { 'Cache-Control': 'no-cache' } });
        if (!res.ok) {
          return;
        }
        const data = (await res.json()) as { messages: SignalEnvelope[] };
        for (const env of data.messages) {
          onEnvelope(env);
        }
      } catch {
        // Transient network error; the next tick retries.
      }
    };
    this.timer = window.setInterval(poll, 700);
    void poll();
  }

  /**
   * Sends a signalling payload to a specific peer.
   */
  async send(to: string, payload: SignalPayload): Promise<void> {
    await fetch(`/api/draft/room/${encodeURIComponent(this.code)}/signal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId: this.playerId, token: this.token, to, payload }),
    });
  }

  stop(): void {
    if (this.timer !== null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  }
}
