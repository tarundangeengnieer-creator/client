/**
 * ASHIELDER Unit Tests: Phase 1 Foundations
 * Validates Defanging Engine, Formatters, Sanitization & Mappers
 */

import { defangEmail, defangIp, defangUrl, refang } from '../../lib/defang.ts';
import { formatBytes, formatConfidence, formatLatency, formatScore } from '../../lib/formatters.ts';
import { escapeHtml, maskPii, stripHtml } from '../../lib/sanitization.ts';

export function runFoundationsValidation(): { passed: number; failed: number; errors: string[] } {
  let passed = 0;
  let failed = 0;
  const errors: string[] = [];

  function assert(condition: boolean, testName: string) {
    if (condition) {
      passed++;
    } else {
      failed++;
      errors.push(`Assertion failed: ${testName}`);
    }
  }

  // 1. Defanging tests
  assert(
    defangUrl('https://evil.attacker.com/payload') === 'hxxps://evil[.]attacker[.]com/payload',
    'defangUrl converts https to hxxps and dots to [.]'
  );
  assert(
    defangUrl('http://phishing.xyz/login') === 'hxxp://phishing[.]xyz/login',
    'defangUrl converts http to hxxp'
  );
  assert(
    defangIp('185.220.101.5') === '185[.]220[.]101[.]5',
    'defangIp converts dots to [.]'
  );
  assert(
    defangEmail('analyst@targetcorp.in') === 'analyst[@]targetcorp[.]in',
    'defangEmail converts @ and dots'
  );
  assert(
    refang('hxxps://safe[.]org/report') === 'https://safe.org/report',
    'refang restores protocol and dots'
  );

  // 2. Formatters tests
  assert(formatBytes(1024) === '1 KB', 'formatBytes formats 1024 as 1 KB');
  assert(formatBytes(25 * 1024 * 1024) === '25 MB', 'formatBytes formats 25MB');
  assert(formatLatency(142) === '142ms', 'formatLatency formats 142ms');
  assert(formatLatency(1420) === '1.42s', 'formatLatency formats 1.42s');
  assert(formatScore(92.5) === '92.5', 'formatScore formats 92.5');
  assert(formatConfidence(0.842) === '84.2%', 'formatConfidence formats 84.2%');

  // 3. Sanitization tests
  assert(
    stripHtml('<p>Hello <script>alert("XSS")</script>World</p>') === 'Hello World',
    'stripHtml removes script tags and contents'
  );
  assert(
    escapeHtml('<img src=x onerror=alert(1)>') === '&lt;img src=x onerror=alert(1)&gt;',
    'escapeHtml escapes angle brackets'
  );
  assert(
    maskPii('Contact john.doe@example.com at 192.168.1.100', true) === 'Contact j***e@example.com at 192.***.***.100',
    'maskPii masks emails and IPs'
  );

  return { passed, failed, errors };
}
