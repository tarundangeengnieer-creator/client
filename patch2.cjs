const fs = require('fs');
let c = fs.readFileSync('src/stores/cases-store.ts', 'utf8');

c = c.replace(/sortDirection: SortDirection;\n}/, `sortDirection: SortDirection;\n  severityFilter: string;\n  statusFilter: string;\n  categoryFilter: string;\n}`);
c = c.replace(/sortDirection: 'desc',\n};/, `sortDirection: 'desc',\n  severityFilter: 'ALL',\n  statusFilter: 'ALL',\n  categoryFilter: 'ALL',\n};`);
c = c.replace(/setVerdictFilter\(filter: 'ALL' \| Verdict\): void {/g, `setFilters(filters: Partial<{ severity: string; status: string; category: string }>): void {
    currentCasesState = {
      ...currentCasesState,
      severityFilter: filters.severity ?? currentCasesState.severityFilter,
      statusFilter: filters.status ?? currentCasesState.statusFilter,
      categoryFilter: filters.category ?? currentCasesState.categoryFilter,
    };
    persistState(currentCasesState.cases, currentCasesState.investigations);
    notifyCases();
  },

  setVerdictFilter(filter: 'ALL' | Verdict): void {`);
c = c.replace(/if \(c.confidence >= 0.6\) return false;\n\n      \/\/ Text search/, `if (c.confidence >= 0.6) return false;

      // SOC Filters
      if (currentCasesState.severityFilter !== 'ALL' && c.severity !== currentCasesState.severityFilter) return false;
      if (currentCasesState.statusFilter !== 'ALL' && c.status !== currentCasesState.statusFilter) return false;
      if (currentCasesState.categoryFilter !== 'ALL' && c.threatCategory !== currentCasesState.categoryFilter) return false;

      // Text search`);

fs.writeFileSync('src/stores/cases-store.ts', c);
