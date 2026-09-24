import { useEffect, useState } from 'react';
import { Boxes, CircleX, FileStack } from 'lucide-react';
import { getServices } from '../api/logApi';
import { ApiError } from '../api/axiosClient';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import type { ServiceSummary } from '../types/Statistics';

export default function Services() {
  const [services, setServices] = useState<ServiceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchServices() {
    setLoading(true);
    try {
      const data = await getServices();
      setServices(data);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to load services.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-ink-primary">Services</h1>
        <p className="text-sm text-ink-secondary">Services currently reporting logs to LogStream.</p>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading services..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchServices} />
      ) : services.length === 0 ? (
        <EmptyState icon={Boxes} title="No services found." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {services.map((s) => (
            <div key={s.name} className="rounded-lg border border-surface-border bg-surface-2 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-ink-primary">{s.name}</h3>
                {s.status && (
                  <span
                    className={`text-[11px] font-medium rounded-md px-2 py-0.5 border ${
                      s.status === 'UP'
                        ? 'text-status-up bg-status-up/10 border-status-up/30'
                        : 'text-status-down bg-status-down/10 border-status-down/30'
                    }`}
                  >
                    {s.status}
                  </span>
                )}
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs text-ink-secondary">
                {s.logCount != null && (
                  <span className="flex items-center gap-1.5">
                    <FileStack size={13} /> {s.logCount.toLocaleString()} logs
                  </span>
                )}
                {s.errorCount != null && (
                  <span className="flex items-center gap-1.5 text-level-error">
                    <CircleX size={13} /> {s.errorCount.toLocaleString()} errors
                  </span>
                )}
                {s.logCount == null && s.errorCount == null && !s.status && (
                  <span className="text-ink-muted">No additional stats reported.</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
