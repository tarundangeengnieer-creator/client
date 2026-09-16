const fs = require('fs');
let c = fs.readFileSync('src/features/inbox/CaseInboxPage.tsx', 'utf8');

if (!c.includes('useCapabilities')) {
  c = c.replace(/import { CheckSquare, Download/, `import { useCapabilities } from '../auth/capabilities.ts';\nimport { CheckSquare, Download`);
  
  c = c.replace(/const selectedCount = casesState.selectedCaseIds.size;/, `const selectedCount = casesState.selectedCaseIds.size;\n  const capabilities = useCapabilities();`);
  
  c = c.replace(/\{\/\* Ingest EML \*\/\}\s*<button[\s\S]*?<span>Ingest \.eml<\/span>\s*<\/button>/, `{/* Ingest EML */}
          {capabilities.canCreateInvestigation && (
            <button
              type="button"
              onClick={() => uiStore.navigate('/ingest')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold transition-colors shadow-[0_0_10px_rgba(14,165,233,0.15)] border border-sky-400/40 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Ingest .eml</span>
            </button>
          )}`);

  // Protect batch operations with canManageCases
  c = c.replace(/<div className="flex items-center gap-2">\s*<button/, `<div className="flex items-center gap-2">\n            {capabilities.canManageCases && <>\n            <button`);
  c = c.replace(/<span>Delete Selected<\/span>\s*<\/button>\s*<\/div>/, `<span>Delete Selected</span>\n            </button>\n            </>}\n          </div>`);
}

fs.writeFileSync('src/features/inbox/CaseInboxPage.tsx', c);
