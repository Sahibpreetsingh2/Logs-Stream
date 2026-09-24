import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      <div className="rounded-full bg-surface-3 p-3">
        <Icon size={20} className="text-ink-muted" aria-hidden="true" />
      </div>
      <p className="text-sm font-medium text-ink-primary">{title}</p>
      {description && <p className="text-xs text-ink-secondary max-w-sm">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
