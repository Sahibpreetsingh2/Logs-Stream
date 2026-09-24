import { useEffect, useState } from 'react';
import { HeartPulse, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { getHealth } from '../api/healthApi';
import { ApiError } from '../api/axiosClient';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import type { HealthResponse } from '../types/Statistics';

function StatusRow({ name, status }: { name: string; status: string }) {
  const isUp = status === 'UP';
  const isDown = status === 'DOWN';
  const Icon = isUp ? CheckCircle2 : isDown ? XCircle : HelpCircle;
  const color = isUp ? 'text-status-up' : isDown ? 'text-status-down' : 'text-status-unknown';

  return (
    <div className="flex items-center justify-between rounded-md border border-surface-border bg-surface-3/40 px-4 py-3">
      <span className="text-sm text-ink-primary">{name}</span>
      <span className={`flex items-center gap-1.5 text-xs font-medium ${color}`}>
        <Icon size={14} />
        {status}
      </span>
    </div>
  );
}

export default function SystemHealth() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchHealth() {
    setLoading(true);
    try {
      const data = await getHealth();
      setHealth(data);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Backend unavailable.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHealth();
    const id = window.setInterval(fetchHealth, 10_000);
    return () => window.clearInterval(id);
  }, []);

  const components = health?.components ?? {};
  const componentNames = Object.keys(components);

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-lg font-semibold text-ink-primary">System Health</h1>
        <p className="text-sm text-ink-secondary">Live status reported by the LogStream backend.</p>
      </div>

      {loading && !health ? (
        <LoadingSpinner label="Checking system health..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchHealth} />
      ) : (
        <div className="rounded-lg border border-surface-border bg-surface-2 p-4 space-y-2.5">
          <StatusRow name="Overall" status={health?.status ?? 'UNKNOWN'} />
          {componentNames.length > 0 ? (
            componentNames.map((name) => (
              <StatusRow key={name} name={name} status={components[name].status} />
            ))
          ) : (
            <div className="flex items-center gap-2 text-xs text-ink-muted px-1 pt-1">
              <HeartPulse size={13} />
              Backend did not return per-component status (Lucene / Alert Engine / Webhook). Only
              the fields actually returned by GET /api/health are shown above.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
