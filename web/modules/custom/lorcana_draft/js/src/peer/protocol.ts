// Wire protocol over the data channel, schema-versioned. 3b.2 only needs a
// hello handshake to prove the channel is live; pick / state messages arrive
// with the two-player draft in 3b.3.
export type WireMessage = { v: 1; t: 'hello'; from: string };

export function isWireMessage(value: unknown): value is WireMessage {
  return typeof value === 'object' && value !== null && (value as { v?: unknown }).v === 1;
}
