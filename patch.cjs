const fs = require('fs');
let c = fs.readFileSync('src/stores/cases-store.ts', 'utf8');

c = c.replace(/id: 'ASH-2026-9012',/g, "id: 'ASH-2026-9012',\n      severity: 'CRITICAL',\n      isSlaBreached: true,\n      threatCategory: 'Credential Phishing',\n      authSignals: { spf: 'FAIL', dkim: 'FAIL', dmarc: 'FAIL' },\n      assignee: 'unassigned',");
c = c.replace(/id: 'ASH-2026-9015',/g, "id: 'ASH-2026-9015',\n      severity: 'HIGH',\n      isSlaBreached: false,\n      threatCategory: 'Business Email Compromise',\n      authSignals: { spf: 'PASS', dkim: 'NONE', dmarc: 'NONE' },\n      assignee: 'Alex Chen',");
c = c.replace(/id: 'ASH-2026-9031',/g, "id: 'ASH-2026-9031',\n      severity: 'MEDIUM',\n      isSlaBreached: false,\n      threatCategory: 'Spam',\n      authSignals: { spf: 'PASS', dkim: 'PASS', dmarc: 'PASS' },\n      assignee: 'unassigned',");

fs.writeFileSync('src/stores/cases-store.ts', c);
