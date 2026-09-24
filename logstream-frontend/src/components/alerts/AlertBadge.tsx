interface AlertBadgeProps {
  level: string;
}

const styles: Record<string, string> = {
  ERROR: 'text-level-error bg-level-error/10 border-level-error/30',
  WARN: 'text-level-warn bg-level-warn/10 border-level-warn/30',
  INFO: 'text-level-info bg-level-info/10 border-level-info/30',
};

export default function AlertBadge({ level }: AlertBadgeProps) {
  const normalized = level?.toUpperCase?.() ?? 'UNKNOWN';
  const style = styles[normalized] ?? 'text-ink-secondary bg-surface-3 border-surface-border';

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium ${style}`}
    >
      {normalized}
    </span>
  );
}
