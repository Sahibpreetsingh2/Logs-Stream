import { FileStack, CircleX, TriangleAlert, Info } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import LogChart from '../components/dashboard/LogChart';
import RecentLogs from '../components/dashboard/RecentLogs';
import ActiveAlerts from '../components/dashboard/ActiveAlerts';
import { useStatistics } from '../hooks/useStatistics';
import { useRecentLogs } from '../hooks/useLogs';
import { useTriggeredAlerts } from '../hooks/useAlerts';
import ErrorMessage from '../components/common/ErrorMessage';

export default function Dashboard() {
  const { stats, timeline, timelineAvailable, loading: statsLoading, error: statsError, refetch: refetchStats } =
    useStatistics();
  const { logs, loading: logsLoading, error: logsError, refetch: refetchLogs } = useRecentLogs(20);
  const { alerts, loading: alertsLoading, error: alertsError, refetch: refetchAlerts } = useTriggeredAlerts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-ink-primary">Dashboard</h1>
        <p className="text-sm text-ink-secondary">Live overview of log volume, alerts, and services.</p>
      </div>

      {statsError && !statsLoading && <ErrorMessage message={statsError} onRetry={refetchStats} />}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Logs" value={stats?.totalLogs ?? (statsLoading ? '—' : 0)} icon={FileStack} />
        <StatCard
          label="Errors"
          value={stats?.errorCount ?? (statsLoading ? '—' : 0)}
          icon={CircleX}
          accent="error"
        />
        <StatCard
          label="Warnings"
          value={stats?.warnCount ?? (statsLoading ? '—' : 0)}
          icon={TriangleAlert}
          accent="warn"
        />
        <StatCard label="Info" value={stats?.infoCount ?? (statsLoading ? '—' : 0)} icon={Info} accent="info" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-lg border border-surface-border bg-surface-2 p-4">
          <h2 className="text-sm font-semibold text-ink-primary mb-3">Logs over time</h2>
          <LogChart data={timeline} available={timelineAvailable} />
        </div>

        <div className="rounded-lg border border-surface-border bg-surface-2 p-4">
          <h2 className="text-sm font-semibold text-ink-primary mb-3">Active alerts</h2>
          <ActiveAlerts alerts={alerts} loading={alertsLoading} error={alertsError} onRetry={refetchAlerts} />
        </div>
      </div>

      <div className="rounded-lg border border-surface-border bg-surface-2 p-4">
        <h2 className="text-sm font-semibold text-ink-primary mb-3">Recent logs</h2>
        <RecentLogs logs={logs} loading={logsLoading} error={logsError} onRetry={refetchLogs} />
      </div>
    </div>
  );
}
