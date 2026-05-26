import React from 'react';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('ErrorBoundary caught:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-p4-bg p-8 flex items-center justify-center p4-scanline">
          <div className="max-w-2xl w-full">
            <div className="relative">
              <div className="absolute inset-0 bg-black transform -skew-x-2 translate-x-2 translate-y-2 -z-10"></div>
              <div className="bg-p4-dark border-4 border-red-600 p-8 transform -skew-x-1 relative z-10">
                <h1 className="text-5xl font-black text-red-400 uppercase mb-6">
                  ❌ Application Error
                </h1>
                <pre className="bg-p4-bg border-4 border-red-600 p-6 overflow-auto text-xs 
                             text-red-300 font-mono leading-relaxed max-h-96">
                  {this.state.error?.message}
                  {'\n\n'}
                  {this.state.error?.stack}
                </pre>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
