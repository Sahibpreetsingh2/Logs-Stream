import { useMemo, useState } from 'react';
import type { LogSearchResult } from '../../types/Log';
import LogLevelBadge from './LogLevelBadge';
import EmptyState from '../common/EmptyState';
import Pagination from '../common/Pagination';
import { FileSearch } from 'lucide-react';

interface LogTableProps {
  results: LogSearchResult[];
  pageSize?: number;
}

export default function LogTable({ results, pageSize = 15 }: LogTableProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(results.length / pageSize));

  const pageResults = useMemo(
    () => results.slice((page - 1) * pageSize, page * pageSize),
    [results, page, pageSize]
  );

  if (results.length === 0) {
    return (
      <EmptyState
        icon={FileSearch}
        title="No logs found."
        description="Try a different keyword or widen the time range."
      />
    );
  }

  return (
    <div className="rounded-lg border border-surface-border bg-surface-2 overflow-hidden">
      <div className="table-scroll">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wide text-ink-muted border-b border-surface-border bg-surface-3">
              <th className="py-2.5 px-3 font-medium">Timestamp</th>
              <th className="py-2.5 px-3 font-medium">Service</th>
              <th className="py-2.5 px-3 font-medium">Level</th>
              <th className="py-2.5 px-3 font-medium">Message</th>
              <th className="py-2.5 px-3 font-medium">Score</th>
            </tr>
          </thead>
          <tbody>
            {pageResults.map((r, i) => (
              <tr key={i} className="border-b border-surface-border/60 last:border-b-0">
                <td className="py-2.5 px-3 mono-num text-xs text-ink-secondary whitespace-nowrap">
                  {r.timestamp ?? '—'}
                </td>
                <td className="py-2.5 px-3 text-ink-primary whitespace-nowrap">{r.service ?? '—'}</td>
                <td className="py-2.5 px-3">
                  <LogLevelBadge level={r.level ?? 'UNKNOWN'} />
                </td>
                <td className="py-2.5 px-3 text-ink-secondary max-w-lg">{r.message}</td>
                <td className="py-2.5 px-3 mono-num text-xs text-ink-secondary">{r.score.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
