import React from 'react';
import { Database, Shield, Hash, Map } from 'lucide-react';

export interface AIContextProps {
  type: 'workspace' | 'threat-intel' | 'graph' | 'global';
  caseId?: string;
  entityName?: string;
}

export const AIContext: React.FC<AIContextProps> = ({ type, caseId, entityName }) => {
  const getContextDetails = () => {
    switch (type) {
      case 'workspace':
        return {
          icon: <Database className="w-3.5 h-3.5 text-blue-500" />,
          label: `Context: Workspace ${caseId ? `(Case #${caseId})` : ''}`,
          desc: 'Analyzing evidence ledger and email artifacts.',
        };
      case 'threat-intel':
        return {
          icon: <Shield className="w-3.5 h-3.5 text-rose-500" />,
          label: 'Context: Threat Intelligence',
          desc: 'Querying global indicators and reputation sources.',
        };
      case 'graph':
        return {
          icon: <Hash className="w-3.5 h-3.5 text-purple-500" />,
          label: 'Context: Graph Analysis',
          desc: `Focus: ${entityName || 'Entity Relations'}`,
        };
      default:
        return {
          icon: <Map className="w-3.5 h-3.5 text-slate-500" />,
          label: 'Context: Global Search',
          desc: 'Agnostic environment overview.',
        };
    }
  };

  const details = getContextDetails();

  return (
    <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 mx-4 mt-4 mb-2">
      <div className="mt-0.5 bg-white dark:bg-slate-800 p-1.5 rounded-md shadow-xs border border-slate-200 dark:border-slate-700">
        {details.icon}
      </div>
      <div>
        <div className="text-[12px] font-bold text-slate-800 dark:text-slate-200 font-mono tracking-tight">
          {details.label}
        </div>
        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
          {details.desc}
        </div>
      </div>
    </div>
  );
};
