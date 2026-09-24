import { useState, type FormEvent } from 'react';
import { UploadCloud, CheckCircle2 } from 'lucide-react';
import { ingestLog } from '../api/logApi';
import { ApiError } from '../api/axiosClient';
import type { LogEntry } from '../types/Log';

const LEVELS = ['INFO', 'WARN', 'ERROR', 'DEBUG'];

const emptyForm: LogEntry = {
  id: '',
  timestamp: '',
  service: '',
  level: 'INFO',
  message: '',
  responseTime: undefined,
};

export default function IngestLog() {
  const [form, setForm] = useState<LogEntry>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function update<K extends keyof LogEntry>(key: K, value: LogEntry[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setFieldErrors({});
    setSuccess(false);

    try {
      await ingestLog({
        ...form,
        timestamp: form.timestamp || new Date().toISOString(),
        responseTime: form.responseTime ? Number(form.responseTime) : undefined,
      });
      setSuccess(true);
      setForm(emptyForm);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        if (err.validationErrors) setFieldErrors(err.validationErrors);
      } else {
        setError('Unable to send log.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-lg space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-ink-primary">Ingest Log</h1>
        <p className="text-sm text-ink-secondary">Manually send a log entry to the backend for indexing.</p>
      </div>

      {success && (
        <div className="flex items-center gap-2 rounded-md border border-status-up/30 bg-status-up/10 px-4 py-3 text-sm text-ink-primary">
          <CheckCircle2 size={16} className="text-status-up" />
          Log received successfully
        </div>
      )}

      {error && (
        <div className="rounded-md border border-level-error/30 bg-level-error/10 px-4 py-3 text-sm text-ink-primary">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-lg border border-surface-border bg-surface-2 p-5 space-y-3.5">
        <div>
          <label className="text-xs text-ink-secondary" htmlFor="id">
            ID
          </label>
          <input
            id="id"
            value={form.id}
            onChange={(e) => update('id', e.target.value)}
            placeholder="ORDER-001"
            className="mt-1 w-full rounded-md border border-surface-border bg-surface-3 px-3 py-2 text-sm text-ink-primary placeholder:text-ink-muted focus:border-brand-dim"
          />
          {fieldErrors.id && <p className="mt-1 text-xs text-level-error">{fieldErrors.id}</p>}
        </div>

        <div>
          <label className="text-xs text-ink-secondary" htmlFor="timestamp">
            Timestamp
          </label>
          <input
            id="timestamp"
            value={form.timestamp}
            onChange={(e) => update('timestamp', e.target.value)}
            placeholder="2026-09-17T11:00:00Z (leave blank for now)"
            className="mt-1 w-full rounded-md border border-surface-border bg-surface-3 px-3 py-2 text-sm text-ink-primary placeholder:text-ink-muted focus:border-brand-dim"
          />
          {fieldErrors.timestamp && <p className="mt-1 text-xs text-level-error">{fieldErrors.timestamp}</p>}
        </div>

        <div>
          <label className="text-xs text-ink-secondary" htmlFor="service">
            Service
          </label>
          <input
            id="service"
            required
            value={form.service}
            onChange={(e) => update('service', e.target.value)}
            placeholder="order-service"
            className="mt-1 w-full rounded-md border border-surface-border bg-surface-3 px-3 py-2 text-sm text-ink-primary placeholder:text-ink-muted focus:border-brand-dim"
          />
          {fieldErrors.service && <p className="mt-1 text-xs text-level-error">{fieldErrors.service}</p>}
        </div>

        <div>
          <label className="text-xs text-ink-secondary" htmlFor="level">
            Level
          </label>
          <select
            id="level"
            value={form.level}
            onChange={(e) => update('level', e.target.value)}
            className="mt-1 w-full rounded-md border border-surface-border bg-surface-3 px-3 py-2 text-sm text-ink-primary focus:border-brand-dim"
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-ink-secondary" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            required
            rows={3}
            value={form.message}
            onChange={(e) => update('message', e.target.value)}
            placeholder="Order processing failed"
            className="mt-1 w-full rounded-md border border-surface-border bg-surface-3 px-3 py-2 text-sm text-ink-primary placeholder:text-ink-muted focus:border-brand-dim"
          />
          {fieldErrors.message && <p className="mt-1 text-xs text-level-error">{fieldErrors.message}</p>}
        </div>

        <div>
          <label className="text-xs text-ink-secondary" htmlFor="responseTime">
            Response Time (ms)
          </label>
          <input
            id="responseTime"
            type="number"
            min={0}
            value={form.responseTime ?? ''}
            onChange={(e) => update('responseTime', e.target.value ? Number(e.target.value) : undefined)}
            placeholder="1500"
            className="mt-1 w-full rounded-md border border-surface-border bg-surface-3 px-3 py-2 text-sm text-ink-primary placeholder:text-ink-muted focus:border-brand-dim"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-medium text-surface-0 hover:bg-brand-glow disabled:opacity-50"
        >
          <UploadCloud size={15} />
          {submitting ? 'Sending...' : 'Send Log'}
        </button>
      </form>
    </div>
  );
}
