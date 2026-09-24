import { useState } from 'react';
import { Plus, Trash2, ListTree } from 'lucide-react';
import AlertRuleForm from '../components/alerts/AlertRuleForm';
import AlertBadge from '../components/alerts/AlertBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import { useAlertRules } from '../hooks/useAlerts';

export default function AlertRules() {
  const { rules, loading, error, mutating, addRule, removeRule, refetch } = useAlertRules();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function confirmDelete() {
    if (!deleteTarget) return;
    const result = await removeRule(deleteTarget);
    if (!result.success) {
      setDeleteError(result.message ?? 'Unable to delete alert rule.');
    } else {
      setDeleteTarget(null);
      setDeleteError(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-ink-primary">Alert Rules</h1>
          <p className="text-sm text-ink-secondary">Define when LogStream should raise an alert.</p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="flex items-center gap-1.5 rounded-md bg-brand px-3.5 py-2 text-sm font-medium text-surface-0 hover:bg-brand-glow transition-colors"
        >
          <Plus size={15} />
          Create Rule
        </button>
      </div>

      {loading && rules.length === 0 ? (
        <LoadingSpinner label="Loading alert rules..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={refetch} />
      ) : rules.length === 0 ? (
        <EmptyState icon={ListTree} title="No alert rules yet." description="Create one to start monitoring a service." />
      ) : (
        <div className="rounded-lg border border-surface-border bg-surface-2 overflow-hidden">
          <div className="table-scroll">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wide text-ink-muted border-b border-surface-border bg-surface-3">
                  <th className="py-2.5 px-3 font-medium">Rule name</th>
                  <th className="py-2.5 px-3 font-medium">Service</th>
                  <th className="py-2.5 px-3 font-medium">Level</th>
                  <th className="py-2.5 px-3 font-medium">Threshold</th>
                  <th className="py-2.5 px-3 font-medium">Window</th>
                  <th className="py-2.5 px-3 font-medium">Notify</th>
                  <th className="py-2.5 px-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((rule) => (
                  <tr key={rule.ruleName} className="border-b border-surface-border/60 last:border-b-0">
                    <td className="py-2.5 px-3 text-ink-primary whitespace-nowrap">{rule.ruleName}</td>
                    <td className="py-2.5 px-3 text-ink-secondary whitespace-nowrap">{rule.serviceName}</td>
                    <td className="py-2.5 px-3">
                      <AlertBadge level={rule.level} />
                    </td>
                    <td className="py-2.5 px-3 mono-num text-ink-primary">{rule.threshold}</td>
                    <td className="py-2.5 px-3 mono-num text-ink-secondary">{rule.windowSeconds}s</td>
                    <td className="py-2.5 px-3 text-ink-secondary capitalize">{rule.notifyType}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => setDeleteTarget(rule.ruleName)}
                        aria-label={`Delete rule ${rule.ruleName}`}
                        className="p-1.5 rounded-md text-ink-secondary hover:text-level-error hover:bg-level-error/10"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {formOpen && <AlertRuleForm onSubmit={addRule} onClose={() => setFormOpen(false)} />}

      {deleteTarget && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-black/50" onClick={() => setDeleteTarget(null)} aria-hidden="true" />
          <div className="relative z-50 w-full max-w-sm rounded-lg border border-surface-border bg-surface-1 p-5 shadow-panel">
            <h2 className="text-sm font-semibold text-ink-primary">Delete alert rule?</h2>
            <p className="mt-1.5 text-sm text-ink-secondary">
              This will permanently remove <span className="text-ink-primary">{deleteTarget}</span>.
            </p>
            {deleteError && <p className="mt-2 text-xs text-level-error">{deleteError}</p>}
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setDeleteTarget(null);
                  setDeleteError(null);
                }}
                className="rounded-md px-3.5 py-2 text-sm text-ink-secondary hover:text-ink-primary hover:bg-surface-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={mutating}
                className="rounded-md bg-level-error px-3.5 py-2 text-sm font-medium text-white hover:bg-level-error/90 disabled:opacity-50"
              >
                {mutating ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
