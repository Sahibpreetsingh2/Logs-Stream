import type { TriggeredAlert } from '../../types/Alert';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import EmptyState from '../common/EmptyState';
import AlertBadge from '../alerts/AlertBadge';
import { ShieldCheck } from 'lucide-react';

interface ActiveAlertsProps {
  alerts: TriggeredAlert[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export default function ActiveAlerts({ alerts, loading, error, onRetry }: ActiveAlertsProps) {
  if (loading && alerts.length === 0) return <LoadingSpinner label="Loading alerts..." />;
  if (error) return <ErrorMessage message={error} onRetry={onRetry} />;
  if (alerts.length === 0) {
    return <EmptyState icon={ShieldCheck} title="No active alerts." description="Everything is within threshold." />;
  }

  return (
    <ul className="space-y-2">
      {alerts.slice(0, 6).map((alert, i) => (
        <li
          key={`${alert.ruleName}-${i}`}
          className="flex items-center justify-between gap-3 rounded-md border border-surface-border bg-surface-3/40 px-3 py-2"
        >
          <div className="min-w-0">
            <p className="text-sm text-ink-primary truncate">{alert.ruleName}</p>
            <p className="text-xs text-ink-secondary truncate">
              {alert.serviceName} · {alert.matchCount}/{alert.threshold} matches
            </p>
          </div>
          <AlertBadge level={alert.level} />
        </li>
      ))}
    </ul>
  );
}
