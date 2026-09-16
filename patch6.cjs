const fs = require('fs');
let c = fs.readFileSync('src/stores/cases-store.ts', 'utf8');
c = c.replace(/sortDirection: 'desc',\n\s*severityFilter: 'ALL',\n\s*statusFilter: 'ALL',\n\s*categoryFilter: 'ALL',/g, `sortDirection: 'desc',`);
fs.writeFileSync('src/stores/cases-store.ts', c);
