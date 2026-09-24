import { AlertTriangle, RotateCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className="flex items-center justify-between gap-4 rounded-md border border-level-error/30 bg-level-error/10 px-4 py-3"
    >
      <div className="flex items-center gap-2 text-sm text-ink-primary">
        <AlertTriangle size={16} className="text-level-error shrink-0" aria-hidden="true" />
        <span>{message}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 rounded-md border border-surface-border px-3 py-1.5 text-xs font-medium text-ink-secondary hover:text-ink-primary hover:border-brand-dim transition-colors"
        >
          <RotateCw size={12} aria-hidden="true" />
          Retry
        </button>
      )}
    </div>
  );
}
