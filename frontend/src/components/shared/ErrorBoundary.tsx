'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { GlassCard } from './GlassCard';
import { GradientButton } from './GradientButton';

/**
 * Error Boundary Props
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
}

/**
 * Error Boundary State
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary component
 * Requirements: 8.5 - Display fallback UI with guest mode indication
 * Wraps pages with error boundaries and displays user-friendly error messages
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });

    // Log error to console in development
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    this.props.onReset?.();
  };

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen-safe flex items-center justify-center p-4">
          <GlassCard className="max-w-sm w-full p-6 text-center">
            {/* Error Icon */}
            <div className="text-5xl mb-4">😵</div>

            {/* Error Title */}
            <h2 className="text-xl font-bold text-white mb-2">
              Something went wrong
            </h2>

            {/* Error Message */}
            <p className="text-text-secondary mb-4">
              We encountered an unexpected error. Please try again.
            </p>

            {/* Error Details (development only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-4 p-3 bg-red-500/20 rounded-lg text-left">
                <p className="text-red-300 text-xs font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <GradientButton
                variant="primary"
                onClick={this.handleReset}
              >
                Try Again
              </GradientButton>

              <button
                onClick={this.handleReload}
                className="text-text-secondary text-sm hover:text-white transition-colors"
              >
                Reload Page
              </button>
            </div>
          </GlassCard>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Screen-level error fallback component
 */
interface ScreenErrorFallbackProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ScreenErrorFallback({
  title = 'Failed to load',
  message = 'Something went wrong while loading this screen.',
  onRetry,
}: ScreenErrorFallbackProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <GlassCard className="max-w-sm w-full p-6 text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-text-secondary text-sm mb-4">{message}</p>
        {onRetry && (
          <GradientButton variant="secondary" onClick={onRetry}>
            Retry
          </GradientButton>
        )}
      </GlassCard>
    </div>
  );
}

/**
 * Network error fallback component
 */
export function NetworkErrorFallback({ onRetry }: { onRetry?: () => void }) {
  return (
    <ScreenErrorFallback
      title="Connection Error"
      message="Please check your internet connection and try again."
      onRetry={onRetry}
    />
  );
}

/**
 * Not found fallback component
 */
export function NotFoundFallback() {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <GlassCard className="max-w-sm w-full p-6 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h3 className="text-lg font-bold text-white mb-2">Not Found</h3>
        <p className="text-text-secondary text-sm mb-4">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <GradientButton
          variant="primary"
          onClick={() => window.location.href = '/'}
        >
          Go Home
        </GradientButton>
      </GlassCard>
    </div>
  );
}

export default ErrorBoundary;
