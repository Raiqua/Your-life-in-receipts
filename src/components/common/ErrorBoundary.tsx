import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by Forensic ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-[400px] w-full flex items-center justify-center p-6 bg-slate-950/80 rounded-2xl border border-red-500/30 text-slate-200 shadow-2xl"
        >
          <div className="max-w-md text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-xl font-bold text-white mb-2">
              {this.props.fallbackTitle || 'Forensic Ledger Exception'}
            </h3>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              An unexpected anomaly occurred while parsing transaction telemetry. The underlying archive remains safe.
            </p>
            {this.state.error && (
              <div className="p-3 mb-6 rounded-lg bg-slate-900 border border-slate-800 text-left font-mono text-xs text-red-300 overflow-x-auto">
                {this.state.error.message}
              </div>
            )}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-2 transition focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reload Archive
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 transition focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
              >
                <Home className="w-3.5 h-3.5" />
                Return to Overview
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
