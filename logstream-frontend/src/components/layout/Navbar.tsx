import { useEffect, useState, type FormEvent } from 'react';
import { Menu, Search, Bell, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getHealth } from '../../api/healthApi';
import { useTriggeredAlerts } from '../../hooks/useAlerts';

interface NavbarProps {
  onMenuClick: () => void;
}

type Overall = 'UP' | 'DOWN' | 'UNKNOWN';

export default function Navbar({ onMenuClick }: NavbarProps) {
  const [status, setStatus] = useState<Overall>('UNKNOWN');
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { alerts } = useTriggeredAlerts();

  useEffect(() => {
    let cancelled = false;
    async function poll() {
      try {
        const health = await getHealth();
        if (!cancelled) setStatus(health.status === 'UP' ? 'UP' : 'DOWN');
      } catch {
        if (!cancelled) setStatus('UNKNOWN');
      }
    }
    poll();
    const id = window.setInterval(poll, 10_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/logs?keyword=${encodeURIComponent(query.trim())}`);
    }
  }

  const statusColor =
    status === 'UP' ? 'text-status-up' : status === 'DOWN' ? 'text-status-down' : 'text-status-unknown';
  const statusLabel = status === 'UP' ? 'All systems up' : status === 'DOWN' ? 'Degraded' : 'Unknown';

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-surface-border bg-surface-1/90 backdrop-blur px-4 lg:px-6">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 -ml-2 rounded-md text-ink-secondary hover:text-ink-primary hover:bg-surface-2"
        aria-label="Toggle navigation menu"
      >
        <Menu size={18} />
      </button>

      <span className="hidden lg:block text-sm font-semibold text-ink-primary">LogStream</span>

      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md ml-auto">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
            aria-hidden="true"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search logs..."
            aria-label="Search logs"
            className="w-full rounded-md border border-surface-border bg-surface-2 pl-9 pr-3 py-1.5 text-sm text-ink-primary placeholder:text-ink-muted focus:border-brand-dim"
          />
        </div>
      </form>

      <button
        aria-label="Notifications"
        className="relative p-2 rounded-md text-ink-secondary hover:text-ink-primary hover:bg-surface-2"
      >
        <Bell size={18} />
        {alerts.length > 0 && (
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-level-error" />
        )}
      </button>

      <div className="hidden sm:flex items-center gap-1.5 text-xs text-ink-secondary">
        <Circle size={8} className={statusColor} fill="currentColor" aria-hidden="true" />
        {statusLabel}
      </div>
    </header>
  );
}
