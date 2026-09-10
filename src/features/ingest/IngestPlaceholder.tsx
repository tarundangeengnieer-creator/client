import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { UploadCloud, FileCode2, ShieldAlert } from 'lucide-react';
import { uiStore } from '../../stores/ui-store.ts';

export const IngestPlaceholder: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto w-full space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl font-bold font-mono text-slate-100 flex items-center gap-2.5">
          <UploadCloud className="w-5 h-5 text-sky-400" />
          <span>INGEST RAW RFC 822 .EML ARTIFACT</span>
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Court-admissible ingestion pipeline with client-side SHA-256 pre-hashing
        </p>
      </div>

      <Card className="border-dashed border-2 border-slate-700 bg-slate-900/40 p-12 text-center">
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-sky-400">
            <FileCode2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-200">
              Drag & Drop RFC 822 .EML or .MSG Email Payload Here
            </p>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Supports up to 25MB raw headers, multipart MIME boundaries & attachments
            </p>
          </div>
          <div className="pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                uiStore.addToast('info', 'Phase 4 Ingestion Dropzone ready');
                uiStore.setActiveCase('CASE-2026-9012', 'Urgent Wire Transfer Request');
                uiStore.navigate('/case/CASE-2026-9012');
              }}
            >
              Load Sample Investigation EML
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
