const fs = require('fs');
let c = fs.readFileSync('src/features/case/CaseDetailPage.tsx', 'utf8');

c = c.replace(/import React, \{ useState, useMemo \} from 'react';/, `import React, { useState, useMemo, useEffect } from 'react';`);

c = c.replace(/import \{ useUI, uiStore \} from '\.\.\/\.\.\/stores\/ui-store\.ts';/, `import { useUI, uiStore } from '../../stores/ui-store.ts';
import { investigatorStore } from '../../stores/investigator-store.ts';
import { useAuth } from '../../stores/auth-store.ts';`);

c = c.replace(/const ui = useUI\(\);/, `const ui = useUI();
  const auth = useAuth();
  const tenantId = auth.currentTenant?.id;`);

c = c.replace(/const caseId = ui\.activeCaseId \|\| 'A2291';/, `const caseId = ui.activeCaseId || 'A2291';

  useEffect(() => {
    if (tenantId && caseId) {
      investigatorStore.selectCase(caseId, tenantId);
    }
  }, [caseId, tenantId]);`);

fs.writeFileSync('src/features/case/CaseDetailPage.tsx', c);
