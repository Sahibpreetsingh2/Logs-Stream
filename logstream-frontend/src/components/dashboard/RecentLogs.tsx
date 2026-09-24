import { useState } from 'react';
import type { LogEntry } from '../../types/Log';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import EmptyState from '../common/EmptyState';
import LogLevelBadge from '../logs/LogLevelBadge';
import LogDetails from '../logs/LogDetails';
import { FileText } from 'lucide-react';

interface RecentLogsProps {
  logs: LogEntry[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export default function RecentLogs({ logs, loading, error, onRetry }: RecentLogsProps) {
  const [selected, setSelected] = useState<LogEntry | null>(null);

  if (loading && logs.length === 0) return <LoadingSpinner label="Loading logs..." />;
  if (error) return <ErrorMessage message={error} onRetry={onRetry} />;
  if (logs.length === 0) return <EmptyState icon={FileText} title="No logs found." />;

  return (
    <>
      <div className="table-scroll">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wide text-ink-muted border-b border-surface-border">
              <th className="py-2 px-3 font-medium">Timestamp</th>
              <th className="py-2 px-3 font-medium">Service</th>
              <th className="py-2 px-3 font-medium">Level</th>
              <th className="py-2 px-3 font-medium">Message</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr
                key={log.id ?? i}
                onClick={() => setSelected(log)}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSelected(log)}
                className="border-b border-surface-border/60 last:border-b-0 cursor-pointer hover:bg-surface-3/60 transition-colors"
              >
                <td className="py-2 px-3 mono-num text-xs text-ink-secondary whitespace-nowrap">
                  {log.timestamp}
                </td>
                <td className="py-2 px-3 text-ink-primary whitespace-nowrap">{log.service}</td>
                <td className="py-2 px-3">
                  <LogLevelBadge level={log.level} />
                </td>
                <td className="py-2 px-3 text-ink-secondary max-w-md truncate">{log.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected && <LogDetails log={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
