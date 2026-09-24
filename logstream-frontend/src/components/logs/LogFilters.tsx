import { useEffect, useState, type FormEvent } from 'react';
import { Search } from 'lucide-react';
import { getServices } from '../../api/logApi';
import type { LogSearchParams } from '../../types/Log';

interface LogFiltersProps {
  initialKeyword?: string;
  onSearch: (params: LogSearchParams) => void;
  loading: boolean;
}

const LEVELS = ['ALL', 'INFO', 'WARN', 'ERROR', 'DEBUG'];

export default function LogFilters({ initialKeyword = '', onSearch, loading }: LogFiltersProps) {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [service, setService] = useState('');
  const [level, setLevel] = useState('ALL');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [services, setServices] = useState<string[]>([]);
  const [servicesError, setServicesError] = useState(false);

  useEffect(() => {
    getServices()
      .then((data) => setServices(data.map((s) => s.name)))
      .catch(() => setServicesError(true));
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!keyword.trim()) return;
    onSearch({
      keyword: keyword.trim(),
      service: service || undefined,
      level,
      from: from || undefined,
      to: to || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          type="text"
          placeholder="Search logs..."
          aria-label="Search keyword"
          className="w-full rounded-md border border-surface-border bg-surface-2 pl-9 pr-3 py-2.5 text-sm text-ink-primary placeholder:text-ink-muted focus:border-brand-dim"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          aria-label="Filter by service"
          className="rounded-md border border-surface-border bg-surface-2 px-2.5 py-2 text-sm text-ink-primary focus:border-brand-dim"
        >
          <option value="">All services</option>
          {services.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          aria-label="Filter by level"
          className="rounded-md border border-surface-border bg-surface-2 px-2.5 py-2 text-sm text-ink-primary focus:border-brand-dim"
        >
          {LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        <input
          type="datetime-local"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          aria-label="From date"
          className="rounded-md border border-surface-border bg-surface-2 px-2.5 py-2 text-sm text-ink-primary focus:border-brand-dim"
        />
        <input
          type="datetime-local"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          aria-label="To date"
          className="rounded-md border border-surface-border bg-surface-2 px-2.5 py-2 text-sm text-ink-primary focus:border-brand-dim"
        />
      </div>

      {servicesError && (
        <p className="text-xs text-ink-muted">
          Service list unavailable (GET /api/logs/services not reachable) — service filter left empty.
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !keyword.trim()}
        className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-surface-0 hover:bg-brand-glow disabled:opacity-50 transition-colors"
      >
        {loading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
}
