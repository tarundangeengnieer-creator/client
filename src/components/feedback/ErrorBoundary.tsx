import React, { ErrorInfo, ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card.tsx';
import { Button } from '../ui/Button.tsx';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error in ASHIELDER Workstation:', error, errorInfo);
    this.setState({ errorInfo });
  }

  public handleReload = (): void => {
    window.location.reload();
  };

  public handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-[calc(100vh-104px)] flex items-center justify-center p-6 bg-slate-950">
          <Card className="max-w-xl w-full border-rose-800/80 bg-slate-900 shadow-2xl">
            <CardHeader className="border-rose-900/60 bg-rose-950/40">
              <CardTitle className="text-rose-200">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                <span>FORENSIC WORKSTATION COMPONENT CRASH</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4 font-mono text-xs">
              <p className="text-slate-300">
                An unexpected exception occurred during evidence rendering. Evidentiary integrity and session state remain isolated in memory.
              </p>
              {this.state.error && (
                <div className="p-3 bg-slate-950 rounded border border-slate-800 text-rose-300 overflow-x-auto whitespace-pre-wrap">
                  {this.state.error.toString()}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={this.handleReset}>
                Attempt Recovery
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={this.handleReload}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Reload Workstation
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
