import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import LogLevelBadge from './LogLevelBadge';
import type { LogEntry } from '../../types/Log';

interface LogDetailsProps {
  log: LogEntry;
  onClose: () => void;
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="py-2.5 border-b border-surface-border last:border-b-0">
      <p className="text-[11px] uppercase tracking-wide text-ink-muted">{label}</p>
      <p className="mt-0.5 text-sm text-ink-primary break-words">{value}</p>
    </div>
  );
}

export default function LogDetails({ log, onClose }: LogDetailsProps) {
  return (
    <div className="fixed inset-0 z-40 flex justify-end" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div className="relative z-50 h-full w-full max-w-md border-l border-surface-border bg-surface-1 shadow-panel flex flex-col">
        <div className="flex items-center justify-between px-5 h-14 border-b border-surface-border shrink-0">
          <h2 className="text-sm font-semibold text-ink-primary">Log details</h2>
          <button
            onClick={onClose}
            aria-label="Close log details"
            className="p-1.5 rounded-md text-ink-secondary hover:text-ink-primary hover:bg-surface-2"
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-2">
          <Field label="Log ID" value={log.id ?? '—'} />
          <Field label="Timestamp" value={log.timestamp} />
          <Field label="Service" value={log.service} />
          <Field label="Level" value={<LogLevelBadge level={log.level} />} />
          <Field label="Message" value={log.message} />
          <Field
            label="Response Time"
            value={log.responseTime != null ? `${log.responseTime} ms` : '—'}
          />
        </div>
      </div>
    </div>
  );
}
