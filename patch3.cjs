const fs = require('fs');
let c = fs.readFileSync('src/stores/cases-store.ts', 'utf8');

c = c.replace(/setVerdictFilter\(verdict: 'ALL' \| Verdict\): void \{/, `setFilters(filters: Partial<{ severity: string; status: string; category: string }>): void {
    currentCasesState = {
      ...currentCasesState,
      severityFilter: filters.severity ?? currentCasesState.severityFilter,
      statusFilter: filters.status ?? currentCasesState.statusFilter,
      categoryFilter: filters.category ?? currentCasesState.categoryFilter,
    };
    persistState(currentCasesState.cases, currentCasesState.investigations);
    notifyCases();
  },

  setVerdictFilter(verdict: 'ALL' | Verdict): void {`);

c = c.replace(/confidenceFilter: 'ALL',\n\s*sortField: 'timestamp',/g, `confidenceFilter: 'ALL',
      severityFilter: 'ALL',
      statusFilter: 'ALL',
      categoryFilter: 'ALL',
      sortField: 'timestamp',`);

// Now for the mock cases, let's target specific ids but make sure they only match within `createDefaultDemonstrationCases` -> `const cases: CaseViewModel[] = [`
// Or we can just do a regex replace that targets the exact object properties.
c = c.replace(/id: 'ASH-2026-9012',\n\s*status: InvestigationStatus.COMPLETED,/, `id: 'ASH-2026-9012',
      severity: 'CRITICAL',
      isSlaBreached: true,
      threatCategory: 'Credential Phishing',
      authSignals: { spf: 'FAIL', dkim: 'FAIL', dmarc: 'FAIL' },
      assignee: 'unassigned',
      status: InvestigationStatus.COMPLETED,`);

c = c.replace(/id: 'ASH-2026-9015',\n\s*status: InvestigationStatus.COMPLETED,/, `id: 'ASH-2026-9015',
      severity: 'HIGH',
      isSlaBreached: false,
      threatCategory: 'Business Email Compromise',
      authSignals: { spf: 'PASS', dkim: 'NONE', dmarc: 'NONE' },
      assignee: 'Alex Chen',
      status: InvestigationStatus.COMPLETED,`);

c = c.replace(/id: 'ASH-2026-9031',\n\s*status: InvestigationStatus.COMPLETED,/, `id: 'ASH-2026-9031',
      severity: 'MEDIUM',
      isSlaBreached: false,
      threatCategory: 'Spam',
      authSignals: { spf: 'PASS', dkim: 'PASS', dmarc: 'PASS' },
      assignee: 'unassigned',
      status: InvestigationStatus.COMPLETED,`);

fs.writeFileSync('src/stores/cases-store.ts', c);
