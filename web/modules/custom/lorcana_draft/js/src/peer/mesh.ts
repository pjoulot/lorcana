// Full-mesh WebRTC manager (raw RTCPeerConnection, our own signalling).
// One ordered/reliable data channel per peer carries the tiny draft messages.
// To avoid offer glare, the peer with the smaller id initiates.
//
// Signalling is non-trickle: each side gathers its ICE candidates into the
// local SDP before sending, so the exchange is a single offer + single answer
// — no candidate spray to race on the DB-backed signal queue.
import type { SignalingClient, SignalPayload } from './signaling';

export type PeerStatus = 'connecting' | 'connected' | 'closed' | 'failed';

export interface MeshEvents {
  onStatus: (peerId: string, status: PeerStatus) => void;
  onMessage: (peerId: string, message: unknown) => void;
}

const ICE_CONFIG: RTCConfiguration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

/** Resolves once ICE gathering completes, or after a timeout. */
function iceComplete(pc: RTCPeerConnection, timeoutMs = 2000): Promise<void> {
  if (pc.iceGatheringState === 'complete') {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const finish = () => {
      pc.removeEventListener('icegatheringstatechange', check);
      resolve();
    };
    const check = () => {
      if (pc.iceGatheringState === 'complete') {
        finish();
      }
    };
    pc.addEventListener('icegatheringstatechange', check);
    window.setTimeout(finish, timeoutMs);
  });
}

interface PeerConn {
  pc: RTCPeerConnection;
  channel: RTCDataChannel | null;
  status: PeerStatus;
}

export class PeerMesh {
  private readonly peers = new Map<string, PeerConn>();

  constructor(
    private readonly myId: string,
    private readonly signaling: SignalingClient,
    private readonly events: MeshEvents,
  ) {}

  /**
   * Opens (or reuses) connections to the given peers.
   */
  connect(peerIds: string[]): void {
    for (const id of peerIds) {
      if (id !== this.myId) {
        this.ensure(id);
      }
    }
  }

  /**
   * Broadcasts a JSON message to every open data channel.
   */
  broadcast(message: unknown): void {
    const data = JSON.stringify(message);
    for (const peer of this.peers.values()) {
      if (peer.channel?.readyState === 'open') {
        peer.channel.send(data);
      }
    }
  }

  /**
   * Number of peers whose data channel is currently open.
   */
  get openCount(): number {
    let n = 0;
    for (const peer of this.peers.values()) {
      if (peer.channel?.readyState === 'open') {
        n++;
      }
    }
    return n;
  }

  /**
   * Handles an inbound signalling envelope addressed to us.
   */
  async handleSignal(from: string, payload: SignalPayload): Promise<void> {
    const peer = this.ensure(from);
    try {
      if (payload.kind === 'offer') {
        await peer.pc.setRemoteDescription({ type: 'offer', sdp: payload.sdp });
        await peer.pc.setLocalDescription(await peer.pc.createAnswer());
        await iceComplete(peer.pc);
        await this.signaling.send(from, { kind: 'answer', sdp: peer.pc.localDescription?.sdp ?? '' });
      } else {
        await peer.pc.setRemoteDescription({ type: 'answer', sdp: payload.sdp });
      }
    } catch {
      this.setStatus(from, 'failed');
    }
  }

  close(): void {
    for (const peer of this.peers.values()) {
      peer.channel?.close();
      peer.pc.close();
    }
    this.peers.clear();
  }

  /**
   * Creates a peer connection on first contact; the smaller id initiates.
   */
  private ensure(peerId: string): PeerConn {
    const existing = this.peers.get(peerId);
    if (existing) {
      return existing;
    }

    const pc = new RTCPeerConnection(ICE_CONFIG);
    const peer: PeerConn = { pc, channel: null, status: 'connecting' };
    this.peers.set(peerId, peer);
    this.setStatus(peerId, 'connecting');

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'failed') {
        this.setStatus(peerId, 'failed');
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'closed') {
        this.setStatus(peerId, 'closed');
      }
    };
    pc.ondatachannel = (e) => this.wireChannel(peerId, peer, e.channel);

    if (this.myId < peerId) {
      // Initiator: create the channel and offer.
      this.wireChannel(peerId, peer, pc.createDataChannel('draft', { ordered: true }));
      void this.makeOffer(peerId, peer);
    }
    return peer;
  }

  private async makeOffer(peerId: string, peer: PeerConn): Promise<void> {
    try {
      await peer.pc.setLocalDescription(await peer.pc.createOffer());
      await iceComplete(peer.pc);
      await this.signaling.send(peerId, { kind: 'offer', sdp: peer.pc.localDescription?.sdp ?? '' });
    } catch {
      this.setStatus(peerId, 'failed');
    }
  }

  private wireChannel(peerId: string, peer: PeerConn, channel: RTCDataChannel): void {
    peer.channel = channel;
    channel.onopen = () => this.setStatus(peerId, 'connected');
    channel.onclose = () => this.setStatus(peerId, 'closed');
    channel.onmessage = (e) => {
      try {
        this.events.onMessage(peerId, JSON.parse(e.data));
      } catch {
        // Ignore malformed frames.
      }
    };
  }

  private setStatus(peerId: string, status: PeerStatus): void {
    const peer = this.peers.get(peerId);
    if (peer) {
      peer.status = status;
    }
    this.events.onStatus(peerId, status);
  }
}
