/**
 * ASHIELDER Hop Mapper
 * Converts backend ReceivedHop structures into visual ReceivedHopNode models
 */

import { ReceivedHop } from '../../contracts/backend.ts';
import { ReceivedHopNode } from '../hop.ts';

export function mapReceivedHopsToNodes(hops: ReceivedHop[]): ReceivedHopNode[] {
  if (!hops || hops.length === 0) return [];

  // Sort hops chronologically: Hop 0 (Origin MTA) to Hop N (Ingress MX)
  const sorted = [...hops].sort((a, b) => a.hop_index - b.hop_index);
  const total = sorted.length;

  return sorted.map((hop, idx) => {
    const isOrigin = idx === 0;
    const isIngress = idx === total - 1;
    const ip = hop.from_ip || hop.by_ip || undefined;

    // Check if private IP
    const isPrivate = ip ? (
      ip.startsWith('10.') ||
      ip.startsWith('192.168.') ||
      ip.startsWith('172.16.') ||
      ip === '127.0.0.1' ||
      ip === '::1'
    ) : false;

    // Latency calculation between hops if timestamps are valid
    let delayMs: number | undefined;
    if (idx > 0 && hop.timestamp && sorted[idx - 1].timestamp) {
      try {
        const tCurr = new Date(hop.timestamp).getTime();
        const tPrev = new Date(sorted[idx - 1].timestamp!).getTime();
        if (!isNaN(tCurr) && !isNaN(tPrev) && tCurr >= tPrev) {
          delayMs = tCurr - tPrev;
        }
      } catch {
        // Ignore date parse errors
      }
    }

    const classification = (hop.ip_classification || '').toLowerCase();
    const isTorExit = classification.includes('tor');
    const isVpn = classification.includes('vpn') || classification.includes('proxy');

    return {
      index: hop.hop_index,
      fromHost: hop.from_host || undefined,
      byHost: hop.by_host || undefined,
      ip,
      timestamp: hop.timestamp || undefined,
      delayMs,
      isOrigin,
      isIngress,
      isTorExit,
      isVpn,
      isPrivateIp: isPrivate,
      rawHeader: hop.raw_line,
      fcrDnsPassed: !classification.includes('mismatch'),
    };
  });
}
