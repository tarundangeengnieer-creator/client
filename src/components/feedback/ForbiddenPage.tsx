import React from 'react';
import { uiStore } from '../../stores/ui-store.ts';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card.tsx';
import { Button } from '../ui/Button.tsx';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const ForbiddenPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-104px)] flex items-center justify-center p-6 bg-slate-950">
      <Card className="max-w-md w-full border-slate-800 bg-slate-900 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-slate-200">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            <span>403: UNAUTHORIZED ACCESS</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 font-mono text-xs">
          <p className="text-slate-300">
            Your current assigned role does not have the necessary privileges to access this area of the application.
          </p>
          <p className="text-slate-400">
            If you believe this is an error, please contact your SOC Administrator.
          </p>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            variant="primary"
            size="sm"
            onClick={() => uiStore.navigate('/overview')}
            leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
          >
            Return to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
