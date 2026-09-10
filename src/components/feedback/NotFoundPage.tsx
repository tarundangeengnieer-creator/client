import React from 'react';
import { uiStore } from '../../stores/ui-store.ts';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card.tsx';
import { Button } from '../ui/Button.tsx';
import { SearchX, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-104px)] flex items-center justify-center p-6 bg-slate-950">
      <Card className="max-w-md w-full border-slate-800 bg-slate-900 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-slate-200">
            <SearchX className="w-5 h-5 text-amber-400" />
            <span>404: RESOURCE NOT FOUND</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 font-mono text-xs">
          <p className="text-slate-300">
            The requested investigation case, indicator route, or administration view does not exist in the current workstation registry.
          </p>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            variant="primary"
            size="sm"
            onClick={() => uiStore.navigate('/inbox')}
            leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
          >
            Return to Case Inbox
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
