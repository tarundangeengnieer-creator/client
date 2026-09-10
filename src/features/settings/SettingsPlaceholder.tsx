import React from 'react';
import { useAuth } from '../../stores/auth-store.ts';
import { useUI, uiStore } from '../../stores/ui-store.ts';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card.tsx';
import { Settings, User, Key, EyeOff } from 'lucide-react';

export const SettingsPlaceholder: React.FC = () => {
  const auth = useAuth();
  const ui = useUI();

  return (
    <div className="p-6 max-w-4xl mx-auto w-full space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl font-bold font-mono text-slate-100 flex items-center gap-2.5">
          <Settings className="w-5 h-5 text-sky-400" />
          <span>WORKSTATION PREFERENCES & AUDIT CONFIG</span>
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Analyst session profile, PII masking defaults, and logging settings
        </p>
      </div>

      <Card className="border-slate-800 bg-slate-900/60 divide-y divide-slate-800">
        <div className="p-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <User className="w-4 h-4 text-sky-400" />
              <span>Analyst Identity</span>
            </div>
            <p className="text-xs text-slate-400">Current active workstation operator</p>
          </div>
          <span className="font-mono text-xs text-slate-300 px-2 py-1 rounded bg-slate-950 border border-slate-800">
            {auth.currentUser?.name || 'Unknown'} ({auth.currentRole || 'No Role'})
          </span>
        </div>

        <div className="p-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-emerald-400" />
              <span>PII Masking by Default</span>
            </div>
            <p className="text-xs text-slate-400">Mask email addresses and IP octets in evidence view</p>
          </div>
          <button
            type="button"
            onClick={() => uiStore.togglePiiMasking()}
            className={`px-3 py-1 rounded font-mono text-xs border cursor-pointer transition-colors ${
              ui.piiMaskingEnabled
                ? 'bg-transparent border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold'
                : 'bg-transparent border-slate-300 dark:border-slate-800 text-slate-500 dark:text-slate-400'
            }`}
          >
            {ui.piiMaskingEnabled ? 'ENABLED' : 'DISABLED'}
          </button>
        </div>
      </Card>
    </div>
  );
};
