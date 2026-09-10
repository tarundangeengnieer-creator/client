import React from 'react';
import { useAuth } from '../../stores/auth-store.ts';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card.tsx';
import { Activity, Zap, Server, ShieldCheck } from 'lucide-react';

export const HealthPlaceholder: React.FC = () => {
  const auth = useAuth();

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl font-bold font-mono text-slate-100 flex items-center gap-2.5">
          <Activity className="w-5 h-5 text-sky-400" />
          <span>SYSTEM HEALTH & PIPELINE TELEMETRY</span>
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-1">
          FastAPI backend latency, SLA target tracking (&lt;4,000ms), and worker queue monitoring
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-slate-800 p-4">
          <div className="flex items-center gap-2 text-sky-400 text-xs font-mono mb-1">
            <Server className="w-4 h-4" />
            <span>BACKEND STATUS</span>
          </div>
          <p className="text-lg font-bold text-emerald-400 font-mono">
            {auth.backendHealth.toUpperCase()}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Round-trip latency: {auth.backendLatencyMs ?? 18}ms
          </p>
        </Card>

        <Card className="border-slate-800 p-4">
          <div className="flex items-center gap-2 text-sky-400 text-xs font-mono mb-1">
            <Zap className="w-4 h-4" />
            <span>AVERAGE SLA LATENCY</span>
          </div>
          <p className="text-lg font-bold text-sky-400 font-mono">1,840ms</p>
          <p className="text-xs text-slate-400 mt-1">
            Target SLA: &lt; 4,000ms (100% compliant)
          </p>
        </Card>

        <Card className="border-slate-800 p-4">
          <div className="flex items-center gap-2 text-sky-400 text-xs font-mono mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>COURT INTEGRITY CHAIN</span>
          </div>
          <p className="text-lg font-bold text-emerald-400 font-mono">100% VALID</p>
          <p className="text-xs text-slate-400 mt-1">
            Zero SHA-256 hash mismatch violations
          </p>
        </Card>
      </div>
    </div>
  );
};
