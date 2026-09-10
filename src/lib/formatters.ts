/**
 * Data Formatters for Digital Forensic Telemetry
 */

export function formatBytes(bytes: number | null | undefined, decimals: number = 1): string {
  if (bytes === null || bytes === undefined || isNaN(bytes) || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatLatency(ms: number | null | undefined): string {
  if (ms === null || ms === undefined || isNaN(ms)) return '0ms';
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export function formatTimestamp(isoString: string | null | undefined): string {
  if (!isoString) return 'N/A';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
  } catch {
    return isoString;
  }
}

export function formatScore(score: number | null | undefined): string {
  if (score === null || score === undefined || isNaN(score)) return '0.0';
  return score.toFixed(1);
}

export function formatConfidence(confidence: number | null | undefined): string {
  if (confidence === null || confidence === undefined || isNaN(confidence)) return '0.0%';
  return `${(confidence * 100).toFixed(1)}%`;
}
