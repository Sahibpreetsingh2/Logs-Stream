import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent?: 'default' | 'error' | 'warn' | 'info';
}

const accentMap: Record<Required<StatCardProps>['accent'], string> = {
  default: 'text-ink-primary bg-surface-3',
  error: 'text-level-error bg-level-error/10',
  warn: 'text-level-warn bg-level-warn/10',
  info: 'text-level-info bg-level-info/10',
};

export default function StatCard({ label, value, icon: Icon, accent = 'default' }: StatCardProps) {
  return (
    <div className="rounded-lg border border-surface-border bg-surface-2 p-4 shadow-panel">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-ink-secondary">{label}</span>
        <div className={`flex items-center justify-center rounded-md p-1.5 ${accentMap[accent]}`}>
          <Icon size={14} aria-hidden="true" />
        </div>
      </div>
      <p className="mt-3 mono-num text-2xl font-semibold text-ink-primary">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
    </div>
  );
}
