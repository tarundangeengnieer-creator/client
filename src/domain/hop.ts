/**
 * ASHIELDER Received Hop Transit Node Model
 */

export interface ReceivedHopNode {
  index: number;
  fromHost?: string;
  byHost?: string;
  ip?: string;
  timestamp?: string;
  delayMs?: number; // Delta latency from previous hop
  isOrigin: boolean;
  isIngress: boolean;
  isTorExit?: boolean;
  isVpn?: boolean;
  isPrivateIp?: boolean;
  rawHeader: string;
  fcrDnsPassed?: boolean;
}
