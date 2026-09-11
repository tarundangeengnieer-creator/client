import React from 'react';
import { useUI, uiStore } from '../../stores/ui-store.ts';
import { ChevronRight, Share2, Copy, Check } from 'lucide-react';

export const Breadcrumbs: React.FC = () => {
  const ui = useUI();
  const [copied, setCopied] = React.useState(false);

  // Generate breadcrumb items based on currentPath
  const getBreadcrumbs = () => {
    const segments = ui.currentPath.split('/').filter(Boolean);
    const items = [{ label: 'HOME', path: '/inbox' }];

    if (segments.length === 0 || segments[0] === 'inbox') {
      items.push({ label: 'CASE INBOX (TRIAGE)', path: '/inbox' });
    } else if (segments[0] === 'ingest') {
      items.push({ label: 'INGEST RFC 822 EML', path: '/ingest' });
    } else if (segments[0] === 'case') {
      items.push({ label: 'INVESTIGATION CASES', path: '/inbox' });
      if (segments[1]) {
        items.push({ label: segments[1], path: `/case/${segments[1]}` });
        if (ui.activeTab) {
          items.push({ label: ui.activeTab.toUpperCase(), path: `/case/${segments[1]}` });
        }
      }
    } else if (segments[0] === 'hunting' || segments[0] === 'threat-intel') {
      items.push({ label: 'THREAT INTELLIGENCE', path: '/hunting' });
    } else if (segments[0] === 'admin') {
      items.push({ label: 'ADMINISTRATION', path: '/admin/health' });
      if (segments[1]) {
        items.push({ label: segments[1].toUpperCase(), path: `/admin/${segments[1]}` });
      }
    } else if (segments[0] === 'settings') {
      items.push({ label: 'SETTINGS', path: '/settings' });
    } else {
      items.push({ label: segments[0].toUpperCase(), path: ui.currentPath });
    }

    return items;
  };

  const breadcrumbs = getBreadcrumbs();

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      uiStore.addToast('success', 'Deep link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      uiStore.addToast('info', 'URL ready');
    }
  };

  return (
    <div className="h-8 bg-slate-900/60 border-b border-slate-800/80 px-4 flex items-center justify-between text-xs select-none shrink-0">
      {/* Hierarchy Path */}
      <nav className="flex items-center gap-1.5 font-mono text-[11px] overflow-hidden">
        {breadcrumbs.map((crumb, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          return (
            <React.Fragment key={`${crumb.path}-${idx}`}>
              {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />}
              {isLast ? (
                <span className="text-sky-400 font-semibold truncate max-w-[240px]">
                  {crumb.label}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => uiStore.navigate(crumb.path)}
                  className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer shrink-0"
                >
                  {crumb.label}
                </button>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* Quick Action bar */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleCopyLink}
          className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-slate-200 transition-colors cursor-pointer px-1.5 py-0.5 rounded hover:bg-slate-800"
          title="Copy Case Deep Link"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Share2 className="w-3 h-3" />}
          <span className="hidden sm:inline">{copied ? 'COPIED' : 'SHARE'}</span>
        </button>
      </div>
    </div>
  );
};
