// React lifecycle wrapper around PeerMesh + SignalingClient. Spins up the
// mesh while `active`, surfaces per-peer status, and serialises inbound
// signalling so SDP/ICE never race.
import { useCallback, useEffect, useRef, useState } from 'react';
import { PeerMesh, type PeerStatus } from './mesh';
import { SignalingClient } from './signaling';

export interface UseMeshResult {
  statuses: Record<string, PeerStatus>;
  broadcast: (message: unknown) => void;
}

export function useMesh(
  active: boolean,
  code: string | null,
  myId: string | null,
  token: string | null,
  peerIds: string[],
  onMessage: (peerId: string, message: unknown) => void,
): UseMeshResult {
  const [statuses, setStatuses] = useState<Record<string, PeerStatus>>({});
  const meshRef = useRef<PeerMesh | null>(null);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  const peerKey = peerIds.join(',');

  useEffect(() => {
    if (!active || !code || !myId || !token) {
      return;
    }
    const signaling = new SignalingClient(code, myId, token);
    const mesh = new PeerMesh(myId, signaling, {
      onStatus: (peerId, status) => setStatuses((s) => ({ ...s, [peerId]: status })),
      onMessage: (peerId, message) => onMessageRef.current(peerId, message),
    });
    meshRef.current = mesh;

    // Apply signalling envelopes one at a time so an answer fully lands
    // before its trailing ICE candidates are processed.
    let chain = Promise.resolve();
    signaling.start((env) => {
      chain = chain.then(() => mesh.handleSignal(env.from, env.payload));
    });
    mesh.connect(peerKey ? peerKey.split(',') : []);

    return () => {
      signaling.stop();
      mesh.close();
      meshRef.current = null;
    };
  }, [active, code, myId, token, peerKey]);

  const broadcast = useCallback((message: unknown) => {
    meshRef.current?.broadcast(message);
  }, []);

  return { statuses, broadcast };
}
