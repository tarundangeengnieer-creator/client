import React, { useState } from 'react';
import { useInvestigator, investigatorStore } from '../../../../stores/investigator-store.ts';
import { EvidenceTypeCategory, InvestigatorEvidence } from '../../../../domain/investigator.ts';
import { 
  FileCheck, Sparkles, Radio, User, Layers, Archive, CheckCircle2, XCircle, Clock
} from 'lucide-react';
import { cn } from '../../../../lib/utils.ts';

export const EvidenceList: React.FC = () => {
  const { caseEvidence, selectedEvidence, isLoadingEvidence, errorEvidence } = useInvestigator();
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvidence = caseEvidence.filter((e) => {
    if (filterCategory !== 'ALL' && e.type !== filterCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!e.title.toLowerCase().includes(q) && !e.description.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const getProvenanceBadge = (type: EvidenceTypeCategory) => {
    switch (type) {
      case 'RAW EVIDENCE':
        return { label: 'OBSERVED', icon: <FileCheck className="w-3 h-3 text-[#08B4ED]" />, classes: 'text-[#08B4ED]' };
      case 'AI FINDING':
        return { label: 'AI', icon: <Sparkles className="w-3 h-3 text-amber-500" />, classes: 'text-amber-600 dark:text-amber-400' };
      case 'THREAT INTELLIGENCE':
        return { label: 'INTEL', icon: <Radio className="w-3 h-3 text-purple-500" />, classes: 'text-purple-600 dark:text-purple-400' };
      case 'ANALYST ANNOTATION':
        return { label: 'HUMAN', icon: <User className="w-3 h-3 text-emerald-600" />, classes: 'text-emerald-600 dark:text-emerald-400' };
      case 'CORRELATION RESULT':
        return { label: 'LINK', icon: <Layers className="w-3 h-3 text-teal-600" />, classes: 'text-teal-600 dark:text-teal-400' };
      default:
        return { label: type, icon: <Archive className="w-3 h-3 text-slate-500" />, classes: 'text-slate-600 dark:text-slate-400' };
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0c1322] border-r border-slate-200 dark:border-slate-800">
      {/* Search and Filters */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0a0f1d] shrink-0 space-y-2">
        <input
          type="text"
          placeholder="Search evidence..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs bg-white dark:bg-[#0e1627] border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1.5 text-slate-700 dark:text-slate-300 outline-none focus:border-[#08B4ED] transition-colors"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-full text-xs font-mono bg-white dark:bg-[#0e1627] border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
        >
          <option value="ALL">All Sources ({caseEvidence.length})</option>
          <option value="RAW EVIDENCE">Observed Evidence</option>
          <option value="AI FINDING">AI Interpretation</option>
          <option value="THREAT INTELLIGENCE">Threat Intel</option>
        </select>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {isLoadingEvidence && (
          <div className="p-8 text-center text-slate-500">
            <div className="w-5 h-5 rounded-full border-2 border-[#08B4ED] border-t-transparent animate-spin mx-auto mb-2" />
          </div>
        )}

        {!isLoadingEvidence && (
          <div className="space-y-4 pb-4">
            {[
              { id: 'OBSERVED EVIDENCE', types: ['RAW EVIDENCE', 'EXTRACTED EVIDENCE'] },
              { id: 'THREAT INTELLIGENCE', types: ['THREAT INTELLIGENCE'] },
              { id: 'AI / ML ANALYSIS', types: ['AI FINDING', 'ML DETECTION'] },
              { id: 'ANALYST ACTION', types: ['ANALYST ANNOTATION', 'CORRELATION RESULT'] },
            ].map(group => {
              const groupItems = filteredEvidence.filter(e => group.types.includes(e.type));
              if (groupItems.length === 0) return null;
              
              return (
                <div key={group.id} className="mb-4">
                  <div className="px-3 py-1.5 bg-slate-100 dark:bg-[#070b14] border-y border-slate-200 dark:border-slate-800 sticky top-0 z-10">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">{group.id}</span>
                  </div>
                  <div>
                    {groupItems.map(ev => {
                      const isSelected = selectedEvidence?.evidence_id === ev.evidence_id;
                      const prov = getProvenanceBadge(ev.type);

                      return (
                        <div
                          key={ev.evidence_id}
                          onClick={() => investigatorStore.selectEvidence(ev)}
                          className={cn(
                            'px-3 py-2.5 border-b border-slate-100 dark:border-slate-800/60 cursor-pointer transition-colors',
                            isSelected ? 'bg-cyan-50/70 dark:bg-[#0f172a] border-l-2 border-l-[#08B4ED]' : 'hover:bg-slate-50 dark:hover:bg-[#0a0f1d] border-l-2 border-l-transparent'
                          )}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold">
                              {prov.icon}
                              <span className={prov.classes}>{prov.label}</span>
                            </div>
                            <div className="flex items-center gap-1 text-[9px] font-mono">
                              {ev.verification_state === 'VERIFIED' && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                              {ev.verification_state === 'DISPUTED' && <XCircle className="w-3 h-3 text-rose-500" />}
                              <span className="text-slate-400">{new Date(ev.collected_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                          </div>
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{ev.title}</h4>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-mono">{ev.source_ref}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
