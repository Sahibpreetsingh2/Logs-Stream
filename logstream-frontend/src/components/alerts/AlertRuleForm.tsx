import { useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import type { AlertRule, NotifyType } from '../../types/Alert';

interface AlertRuleFormProps {
  onSubmit: (rule: AlertRule) => Promise<{ success: boolean; message?: string; validationErrors?: Record<string, string> }>;
  onClose: () => void;
}

const LEVELS = ['INFO', 'WARN', 'ERROR', 'DEBUG'];
const NOTIFY_TYPES: NotifyType[] = ['webhook', 'email', 'slack'];

export default function AlertRuleForm({ onSubmit, onClose }: AlertRuleFormProps) {
  const [ruleName, setRuleName] = useState('');
  const [threshold, setThreshold] = useState(5);
  const [windowSeconds, setWindowSeconds] = useState(120);
  const [serviceName, setServiceName] = useState('');
  const [level, setLevel] = useState('ERROR');
  const [notifyType, setNotifyType] = useState<NotifyType>('webhook');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setFieldErrors({});

    const result = await onSubmit({
      ruleName,
      threshold,
      windowSeconds,
      serviceName,
      level,
      notifyType,
    });

    setSubmitting(false);
    if (result.success) {
      onClose();
    } else {
      setFormError(result.message ?? 'Unable to create alert rule.');
      if (result.validationErrors) setFieldErrors(result.validationErrors);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div className="relative z-50 w-full max-w-md rounded-lg border border-surface-border bg-surface-1 shadow-panel">
        <div className="flex items-center justify-between px-5 h-14 border-b border-surface-border">
          <h2 className="text-sm font-semibold text-ink-primary">Create alert rule</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-md text-ink-secondary hover:text-ink-primary hover:bg-surface-2"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          {formError && (
            <p className="text-xs text-level-error bg-level-error/10 border border-level-error/30 rounded-md px-3 py-2">
              {formError}
            </p>
          )}

          <div>
            <label className="text-xs text-ink-secondary" htmlFor="ruleName">
              Rule name
            </label>
            <input
              id="ruleName"
              required
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              placeholder="order-error-rate"
              className="mt-1 w-full rounded-md border border-surface-border bg-surface-2 px-3 py-2 text-sm text-ink-primary placeholder:text-ink-muted focus:border-brand-dim"
            />
            {fieldErrors.ruleName && (
              <p className="mt-1 text-xs text-level-error">{fieldErrors.ruleName}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-ink-secondary" htmlFor="threshold">
                Threshold
              </label>
              <input
                id="threshold"
                type="number"
                min={1}
                required
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="mt-1 w-full rounded-md border border-surface-border bg-surface-2 px-3 py-2 text-sm text-ink-primary focus:border-brand-dim"
              />
            </div>
            <div>
              <label className="text-xs text-ink-secondary" htmlFor="windowSeconds">
                Window (seconds)
              </label>
              <input
                id="windowSeconds"
                type="number"
                min={1}
                required
                value={windowSeconds}
                onChange={(e) => setWindowSeconds(Number(e.target.value))}
                className="mt-1 w-full rounded-md border border-surface-border bg-surface-2 px-3 py-2 text-sm text-ink-primary focus:border-brand-dim"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-ink-secondary" htmlFor="serviceName">
              Service name
            </label>
            <input
              id="serviceName"
              required
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="order-service"
              className="mt-1 w-full rounded-md border border-surface-border bg-surface-2 px-3 py-2 text-sm text-ink-primary placeholder:text-ink-muted focus:border-brand-dim"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-ink-secondary" htmlFor="level">
                Level
              </label>
              <select
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="mt-1 w-full rounded-md border border-surface-border bg-surface-2 px-3 py-2 text-sm text-ink-primary focus:border-brand-dim"
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-ink-secondary" htmlFor="notifyType">
                Notification type
              </label>
              <select
                id="notifyType"
                value={notifyType}
                onChange={(e) => setNotifyType(e.target.value as NotifyType)}
                className="mt-1 w-full rounded-md border border-surface-border bg-surface-2 px-3 py-2 text-sm text-ink-primary focus:border-brand-dim"
              >
                {NOTIFY_TYPES.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-4 py-2 text-sm text-ink-secondary hover:text-ink-primary hover:bg-surface-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-surface-0 hover:bg-brand-glow disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create rule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
