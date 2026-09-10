/**
 * ASHIELDER Zero-Trust Sanitization & Safe Display Engine
 * Enforces RSK-02 (P0 Security Invariant): Prevents DOM XSS & Unsafe HTML Rendering
 */

export function escapeHtml(unsafe: string | null | undefined): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function stripHtml(html: string | null | undefined): string {
  if (!html) return '';
  // Remove script and style tags completely along with content
  let text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ');
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ');
  // Strip all other HTML tags
  text = text.replace(/<[^>]+>/g, ' ');
  // Decode common HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
  // Collapse whitespace
  return text.replace(/\s+/g, ' ').trim();
}

export function maskPii(text: string | null | undefined, enabled: boolean = true): string {
  if (!text || !enabled) return text || '';
  // Mask email addresses: john.doe@example.com -> j***e@example.com
  const emailMasked = text.replace(/([a-zA-Z0-9._%+-])[a-zA-Z0-9._%+-]*([a-zA-Z0-9])@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '$1***$2@$3');
  // Mask middle octets of IPv4: 192.168.1.100 -> 192.***.***.100
  const ipMasked = emailMasked.replace(/(\b\d{1,3}\.)\d{1,3}\.\d{1,3}(\.\d{1,3}\b)/g, '$1***.***$2');
  return ipMasked;
}
