import type { TriggeredAlert } from '../../types/Alert';
import AlertBadge from './AlertBadge';
import EmptyState from '../common/EmptyState';
import { ShieldCheck } from 'lucide-react';

interface AlertTableProps {
  alerts: TriggeredAlert[];
}

export default function AlertTable({ alerts }: AlertTableProps) {
  if (alerts.length === 0) {
    return (
      <EmptyState
        icon={ShieldCheck}
        title="No active alerts."
        description="Triggered alerts will appear here as soon as a rule's threshold is crossed."
      />
    );
  }

  return (
    <div className="rounded-lg border border-surface-border bg-surface-2 overflow-hidden">
      <div className="table-scroll">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wide text-ink-muted border-b border-surface-border bg-surface-3">
              <th className="py-2.5 px-3 font-medium">Rule</th>
              <th className="py-2.5 px-3 font-medium">Service</th>
              <th className="py-2.5 px-3 font-medium">Level</th>
              <th className="py-2.5 px-3 font-medium">Matches</th>
              <th className="py-2.5 px-3 font-medium">Threshold</th>
              <th className="py-2.5 px-3 font-medium">Triggered At</th>
              <th className="py-2.5 px-3 font-medium">Notification</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((a, i) => (
              <tr key={`${a.ruleName}-${i}`} className="border-b border-surface-border/60 last:border-b-0">
                <td className="py-2.5 px-3 text-ink-primary whitespace-nowrap">{a.ruleName}</td>
                <td className="py-2.5 px-3 text-ink-secondary whitespace-nowrap">{a.serviceName}</td>
                <td className="py-2.5 px-3">
                  <AlertBadge level={a.level} />
                </td>
                <td className="py-2.5 px-3 mono-num text-ink-primary">{a.matchCount}</td>
                <td className="py-2.5 px-3 mono-num text-ink-secondary">{a.threshold}</td>
                <td className="py-2.5 px-3 mono-num text-xs text-ink-secondary whitespace-nowrap">
                  {a.triggeredAt}
                </td>
                <td className="py-2.5 px-3 text-ink-secondary capitalize whitespace-nowrap">
                  {a.notifyType ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
