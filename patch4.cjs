const fs = require('fs');
let c = fs.readFileSync('src/stores/cases-store.ts', 'utf8');

c = c.replace(/severity: '.*?',\s*isSlaBreached: (true|false),\s*threatCategory: '.*?',\s*authSignals: \{.*?\},\s*assignee: '.*?',/g, '');

c = c.replace(/id: 'ASH-2026-9012',\s*status: InvestigationStatus.COMPLETED,/g, `id: 'ASH-2026-9012',
      severity: 'CRITICAL',
      isSlaBreached: true,
      threatCategory: 'Credential Phishing',
      authSignals: { spf: 'FAIL', dkim: 'FAIL', dmarc: 'FAIL' },
      assignee: 'unassigned',
      status: InvestigationStatus.COMPLETED,`);

c = c.replace(/id: 'ASH-2026-9015',\s*status: InvestigationStatus.COMPLETED,/g, `id: 'ASH-2026-9015',
      severity: 'HIGH',
      isSlaBreached: false,
      threatCategory: 'Business Email Compromise',
      authSignals: { spf: 'PASS', dkim: 'NONE', dmarc: 'NONE' },
      assignee: 'Alex Chen',
      status: InvestigationStatus.COMPLETED,`);

c = c.replace(/id: 'ASH-2026-9031',\s*status: InvestigationStatus.COMPLETED,/g, `id: 'ASH-2026-9031',
      severity: 'MEDIUM',
      isSlaBreached: false,
      threatCategory: 'Spam',
      authSignals: { spf: 'PASS', dkim: 'PASS', dmarc: 'PASS' },
      assignee: 'unassigned',
      status: InvestigationStatus.COMPLETED,`);

// Also fix multiple properties with the same name which happened because of patch3 probably running twice or similar.
c = c.replace(/confidenceFilter: 'ALL',\s*severityFilter: 'ALL',\s*statusFilter: 'ALL',\s*categoryFilter: 'ALL',\s*sortField: 'timestamp',/g, `confidenceFilter: 'ALL',
      sortField: 'timestamp',`);
c = c.replace(/confidenceFilter: 'ALL',\s*sortField: 'timestamp',/g, `confidenceFilter: 'ALL',
      severityFilter: 'ALL',
      statusFilter: 'ALL',
      categoryFilter: 'ALL',
      sortField: 'timestamp',`);

fs.writeFileSync('src/stores/cases-store.ts', c);
