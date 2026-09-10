import React, { useState, useEffect, useRef } from 'react';
import { useUI, uiStore } from '../../stores/ui-store.ts';
import { Search, ArrowRight, ShieldAlert, Crosshair, FileCheck, X } from 'lucide-react';

interface QuickResult {
  id: string;
  type: 'case' | 'ioc' | 'evidence' | 'navigation';
  title: string;
  subtitle: string;
  path: string;
}

export const GlobalSearchModal: React.FC = () => {
  const ui = useUI();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Focus input on modal open
  useEffect(() => {
    if (ui.isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [ui.isSearchOpen]);

  // Global keyboard shortcut: Ctrl+K / Cmd+K and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        uiStore.setSearchOpen(!ui.isSearchOpen);
      } else if (e.key === 'Escape' && ui.isSearchOpen) {
        uiStore.setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [ui.isSearchOpen]);

  if (!ui.isSearchOpen) return null;

  // Sample quick targets matching query
  const query = ui.searchQuery.toLowerCase().trim();

  const allItems: QuickResult[] = [
    {
      id: 'nav-inbox',
      type: 'navigation',
      title: 'Triage Queue / Case Inbox',
      subtitle: 'Jump to all active and pending investigations',
      path: '/inbox',
    },
    {
      id: 'nav-ingest',
      type: 'navigation',
      title: 'Ingest Raw RFC 822 .EML',
      subtitle: 'Upload and trigger forensic pipeline',
      path: '/ingest',
    },
    {
      id: 'nav-hunting',
      type: 'navigation',
      title: 'Threat Hunting & Indicator Pivot',
      subtitle: 'Cross-case correlate IPs, domains, and hashes',
      path: '/hunting',
    },
    {
      id: 'case-9012',
      type: 'case',
      title: 'CASE-2026-9012: Urgent Wire Transfer Request',
      subtitle: 'Verdict: MALICIOUS (Risk: 94.2) | Origin: 185.220.101.5 (Tor Exit)',
      path: '/case/CASE-2026-9012',
    },
    {
      id: 'case-9013',
      type: 'case',
      title: 'CASE-2026-9013: Invoice_March2026.pdf.exe',
      subtitle: 'Verdict: MALICIOUS (Risk: 88.0) | Mismatched MIME executable',
      path: '/case/CASE-2026-9013',
    },
    {
      id: 'case-9014',
      type: 'case',
      title: 'CASE-2026-9014: Monthly Internal Newsletter',
      subtitle: 'Verdict: BENIGN (Risk: 4.5) | Clean DKIM & DMARC alignment',
      path: '/case/CASE-2026-9014',
    },
    {
      id: 'ioc-185',
      type: 'ioc',
      title: '185.220.101.5 (Origin Relay IP)',
      subtitle: 'Classified Tor Exit Relay | 3 related campaigns',
      path: '/hunting?q=185.220.101.5',
    },
    {
      id: 'evd-hdr-01',
      type: 'evidence',
      title: 'EVD-HDR-001: Display Name Spoofing',
      subtitle: 'Header Analyzer finding | Risk weight +35',
      path: '/case/CASE-2026-9012?evidence=EVD-HDR-001',
    },
  ];

  const filtered = query
    ? allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.subtitle.toLowerCase().includes(query) ||
          item.type.includes(query)
      )
    : allItems;

  const handleSelect = (item: QuickResult) => {
    uiStore.setSearchOpen(false);
    uiStore.navigate(item.path);
  };

  const handleKeyDownInList = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        handleSelect(filtered[selectedIndex]);
      }
    }
  };

  const getIcon = (type: QuickResult['type']) => {
    switch (type) {
      case 'case':
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'ioc':
        return <Crosshair className="w-4 h-4 text-amber-400" />;
      case 'evidence':
        return <FileCheck className="w-4 h-4 text-sky-400" />;
      case 'navigation':
      default:
        return <ArrowRight className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-xs">
      <div
        className="fixed inset-0"
        onClick={() => uiStore.setSearchOpen(false)}
        aria-hidden="true"
      />
      <div
        className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-lg shadow-2xl z-10 overflow-hidden flex flex-col"
        onKeyDown={handleKeyDownInList}
      >
        {/* Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={ui.searchQuery}
            onChange={(e) => {
              uiStore.setSearchQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search cases, IOCs, headers, evidence IDs..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-sm focus:outline-none font-mono"
          />
          <button
            type="button"
            onClick={() => uiStore.setSearchOpen(false)}
            className="p-1 rounded text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs font-mono text-slate-400">
              NO MATCHING CASES OR IOCS FOUND FOR &quot;{ui.searchQuery}&quot;
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-2.5 rounded cursor-pointer transition-colors ${
                    isSelected ? 'bg-slate-800 text-slate-100' : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-7 h-7 rounded bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                      {getIcon(item.type)}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-xs font-semibold truncate font-mono">{item.title}</span>
                      <span className="text-[11px] text-slate-400 truncate">{item.subtitle}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 uppercase shrink-0">
                    {item.type}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-3 py-2 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-sky-400 font-semibold">ASHIELDER GLOBAL INDEX</span>
        </div>
      </div>
    </div>
  );
};
