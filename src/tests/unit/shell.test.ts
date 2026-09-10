/**
 * ASHIELDER Unit Tests: Phase 2 Application Shell & Store Verification
 * Validates Auth Store, UI Store, Route Transitions, and HUD State
 */

import { authStore } from '../../stores/auth-store.ts';
import { uiStore } from '../../stores/ui-store.ts';
import { Verdict } from '../../contracts/backend.ts';

export async function runShellValidation(): Promise<{ passed: number; failed: number; errors: string[] }> {
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

  // 1. Auth Store Tests
  await authStore.login('alice@soc.local', 'password123');
  const authSnap = authStore.getSnapshot();
  assert(authSnap.isAuthenticated === true, 'authStore.login sets isAuthenticated to true');
  assert(authSnap.token !== null, 'authStore.login generates token');
  assert(authSnap.currentUser?.id === 'usr_soc_01', 'authStore.login sets currentUser correctly');

  // 2. UI Store Navigation & Active Case HUD
  uiStore.navigate('/ingest');
  assert(uiStore.getSnapshot().currentPath === '/ingest', 'uiStore.navigate updates currentPath to /ingest');

  uiStore.setActiveCase('CASE-2026-9012', 'Urgent Wire Transfer', Verdict.MALICIOUS, 94.2, 0.96);
  const hudSnap = uiStore.getSnapshot();
  assert(hudSnap.activeCaseId === 'CASE-2026-9012', 'setActiveCase sets activeCaseId');
  assert(hudSnap.activeCaseVerdict === Verdict.MALICIOUS, 'setActiveCase sets activeCaseVerdict');
  assert(hudSnap.activeCaseRisk === 94.2, 'setActiveCase sets activeCaseRisk');
  assert(hudSnap.activeCaseConfidence === 0.96, 'setActiveCase sets activeCaseConfidence');

  // 3. Search modal and PII toggling
  uiStore.setSearchOpen(true);
  assert(uiStore.getSnapshot().isSearchOpen === true, 'setSearchOpen(true) opens search');
  uiStore.setSearchOpen(false);
  assert(uiStore.getSnapshot().isSearchOpen === false, 'setSearchOpen(false) closes search');

  const piiInitial = uiStore.getSnapshot().piiMaskingEnabled;
  uiStore.togglePiiMasking();
  assert(uiStore.getSnapshot().piiMaskingEnabled === !piiInitial, 'togglePiiMasking toggles state');
  uiStore.togglePiiMasking(); // restore

  // 4. Toast lifecycle
  uiStore.addToast('info', 'Test notification');
  assert(uiStore.getSnapshot().toasts.length > 0, 'addToast appends a toast message');

  return { passed, failed, errors };
}
