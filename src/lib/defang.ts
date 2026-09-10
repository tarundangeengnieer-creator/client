/**
 * ASHIELDER RFC-Compliant Defanging Engine
 * Enforces RSK-01 (P0 Security Invariant): Prevents accidental analyst click execution.
 */

/**
 * Defangs a URL or IP address by replacing protocols and dots with safe notation.
 * E.g., https://malicious.evil.com/payload -> hxxps://malicious[.]evil[.]com/payload
 * E.g., 185.220.101.5 -> 185[.]220[.]101[.]5
 */
export function defangUrl(url: string | null | undefined): string {
  if (!url) return '';
  return url
    .replace(/^http:\/\//i, 'hxxp://')
    .replace(/^https:\/\//i, 'hxxps://')
    .replace(/^ftp:\/\//i, 'fxp://')
    .replace(/\./g, '[.]')
    .replace(/@/g, '[@]');
}

/**
 * Defangs an IP address.
 * E.g., 192.168.1.1 -> 192[.]168[.]1[.]1
 */
export function defangIp(ip: string | null | undefined): string {
  if (!ip) return '';
  return ip.replace(/\./g, '[.]').replace(/:/g, '[:]');
}

/**
 * Defangs an email address.
 * E.g., ceo@targetcorp.in -> ceo[@]targetcorp[.]in
 */
export function defangEmail(email: string | null | undefined): string {
  if (!email) return '';
  return email.replace(/@/g, '[@]').replace(/\./g, '[.]');
}

/**
 * Restores a defanged string back to its raw form for safe copying.
 */
export function refang(defanged: string): string {
  if (!defanged) return '';
  return defanged
    .replace(/^hxxps:\/\//i, 'https://')
    .replace(/^hxxp:\/\//i, 'http://')
    .replace(/^fxp:\/\//i, 'ftp://')
    .replace(/\[\.\]/g, '.')
    .replace(/\[@\]/g, '@')
    .replace(/\[:\]/g, ':');
}
