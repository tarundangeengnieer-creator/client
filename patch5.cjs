const fs = require('fs');
let c = fs.readFileSync('src/stores/cases-store.ts', 'utf8');

c = c.replace(/investigation_id: 'ASH-2026-9012',[\s\S]*?status: InvestigationStatus.COMPLETED,/g, `investigation_id: 'ASH-2026-9012',\n    status: InvestigationStatus.COMPLETED,`);
c = c.replace(/investigation_id: 'ASH-2026-9015',[\s\S]*?status: InvestigationStatus.COMPLETED,/g, `investigation_id: 'ASH-2026-9015',\n    status: InvestigationStatus.COMPLETED,`);
c = c.replace(/investigation_id: 'ASH-2026-9031',[\s\S]*?status: InvestigationStatus.COMPLETED,/g, `investigation_id: 'ASH-2026-9031',\n    status: InvestigationStatus.COMPLETED,`);

// Also fix the cases object properties duplicated
c = c.replace(/investigations: initialData.investigations,\n\s*selectedCaseIds: new Set<string>\(\),\n\s*focusedIndex: 0,\n\s*densityMode: 'standard',\n\s*searchQuery: '',\n\s*verdictFilter: 'ALL',\n\s*riskFilter: 'ALL',\n\s*confidenceFilter: 'ALL',\n\s*severityFilter: 'ALL',\n\s*statusFilter: 'ALL',\n\s*categoryFilter: 'ALL',\n\s*sortField: 'timestamp',\n\s*severityFilter: 'ALL',\n\s*statusFilter: 'ALL',\n\s*categoryFilter: 'ALL',\n\s*sortField: 'timestamp',\n\s*sortDirection: 'desc',\n\s*severityFilter: 'ALL',\n\s*statusFilter: 'ALL',\n\s*categoryFilter: 'ALL',/g, 
`investigations: initialData.investigations,
  selectedCaseIds: new Set<string>(),
  focusedIndex: 0,
  densityMode: 'standard',
  searchQuery: '',
  verdictFilter: 'ALL',
  riskFilter: 'ALL',
  confidenceFilter: 'ALL',
  severityFilter: 'ALL',
  statusFilter: 'ALL',
  categoryFilter: 'ALL',
  sortField: 'timestamp',
  sortDirection: 'desc',`);

fs.writeFileSync('src/stores/cases-store.ts', c);
