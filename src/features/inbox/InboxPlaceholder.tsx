import React from 'react';
import { uiStore } from '../../stores/ui-store.ts';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { Badge } from '../../components/ui/Badge.tsx';
import { Mail, UploadCloud, ShieldAlert, FileText, ArrowRight } from 'lucide-react';

export const InboxPlaceholder: React.FC = () => {
  const sampleCases = [
    {
      id: 'CASE-2026-9012',
      subject: 'URGENT: Executive Wire Transfer Authorization for Q1 Vendor',
      sender: 'cfo@corp-finance-update.com',
      verdict: 'MALICIOUS',
      riskScore: 94.2,
      confidence: 0.96,
      originIp: '185.220.101.5 (Tor Exit)',
      hops: 4,
      attachments: 0,
      time: '2 mins ago',
    },
    {
      id: 'CASE-2026-9013',
      subject: 'Updated Purchase Order & Invoice Statement #PO-88219',
      sender: 'billing@fast-invoicing.net',
      verdict: 'MALICIOUS',
      riskScore: 88.0,
      confidence: 0.91,
      originIp: '91.240.118.14 (RU Bulletproof)',
      hops: 3,
      attachments: 1,
      time: '14 mins ago',
    },
    {
      id: 'CASE-2026-9014',
      subject: 'Weekly Infrastructure Health Digest & Security Advisory',
      sender: 'devops-reports@internal.company.io',
      verdict: 'BENIGN',
      riskScore: 4.2,
      confidence: 0.98,
      originIp: '104.244.42.1 (AWS Ingress)',
      hops: 2,
      attachments: 0,
      time: '1 hour ago',
    },
  ];

  const handleOpenCase = (c: typeof sampleCases[0]) => {
    uiStore.setActiveCase(c.id, c.subject, c.verdict as any, c.riskScore, c.confidence);
    uiStore.navigate(`/case/${c.id}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold font-mono text-slate-100 flex items-center gap-2.5">
            <Mail className="w-5 h-5 text-sky-400" />
            <span>CASE INBOX & TRIAGE QUEUE</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Real-time pipeline ingestion queue with SLA tracking and priority triage
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => uiStore.navigate('/ingest')}
            leftIcon={<UploadCloud className="w-4 h-4" />}
          >
            Ingest .EML File
          </Button>
        </div>
      </div>

      {/* Triage Table / Cards */}
      <Card className="border-slate-800 bg-slate-900/80">
        <CardHeader className="py-2.5 px-4 bg-slate-950/60 flex items-center justify-between">
          <CardTitle className="text-xs font-mono text-slate-300">
            ACTIVE FORENSIC CASES ({sampleCases.length})
          </CardTitle>
          <span className="text-[11px] font-mono text-slate-400">
            Phase 2 Shell Active — Ready for Phase 3 Virtualized Triage Queue
          </span>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-800/80">
            {sampleCases.map((item) => (
              <div
                key={item.id}
                onClick={() => handleOpenCase(item)}
                className="p-4 hover:bg-slate-850/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer group"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-semibold text-sky-400 group-hover:underline">
                      {item.id}
                    </span>
                    <Badge
                      variant={
                        item.verdict === 'MALICIOUS'
                          ? 'malicious'
                          : item.verdict === 'SUSPICIOUS'
                          ? 'suspicious'
                          : 'benign'
                      }
                    >
                      {item.verdict}
                    </Badge>
                    <span className="text-[11px] font-mono text-slate-400">
                      Risk: <strong className={item.riskScore > 70 ? 'text-rose-400' : 'text-emerald-400'}>{item.riskScore}</strong>
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Conf: {(item.confidence * 100).toFixed(0)}%
                    </span>
                  </div>

                  <p className="text-sm font-medium text-slate-200 truncate">
                    {item.subject}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                    <span>From: {item.sender}</span>
                    <span>Origin: {item.originIp}</span>
                    <span>Hops: {item.hops}</span>
                    <span>{item.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenCase(item);
                    }}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Investigate
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
