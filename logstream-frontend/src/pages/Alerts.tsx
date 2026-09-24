import AlertTable from '../components/alerts/AlertTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { useTriggeredAlerts } from '../hooks/useAlerts';

export default function Alerts() {
  const { alerts, loading, error, refetch } = useTriggeredAlerts();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-ink-primary">Alerts</h1>
        <p className="text-sm text-ink-secondary">
          Triggered alerts from the alert engine, refreshed every 10 seconds.
        </p>
      </div>

      {loading && alerts.length === 0 ? (
        <LoadingSpinner label="Loading alerts..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={refetch} />
      ) : (
        <AlertTable alerts={alerts} />
      )}
    </div>
  );
}
