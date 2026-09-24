import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  BellRing,
  ListTree,
  Boxes,
  UploadCloud,
  HeartPulse,
  Settings,
  Waves,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/logs', label: 'Log Explorer', icon: Search },
  { to: '/alerts', label: 'Alerts', icon: BellRing },
  { to: '/alert-rules', label: 'Alert Rules', icon: ListTree },
  { to: '/services', label: 'Services', icon: Boxes },
  { to: '/ingest', label: 'Ingest Log', icon: UploadCloud },
  { to: '/system-health', label: 'System Health', icon: HeartPulse },
];

interface SidebarProps {
  open: boolean;
  onNavigate?: () => void;
}

export default function Sidebar({ open, onNavigate }: SidebarProps) {
  return (
    <aside
      className={`fixed z-30 inset-y-0 left-0 w-60 flex-col border-r border-surface-border bg-surface-1 transition-transform duration-200 lg:static lg:translate-x-0 lg:flex ${
        open ? 'translate-x-0 flex' : '-translate-x-full flex'
      }`}
    >
      <div className="flex items-center gap-2 px-5 h-16 border-b border-surface-border shrink-0">
        <div className="flex items-center justify-center w-7 h-7 rounded-md bg-brand/15">
          <Waves size={16} className="text-brand" aria-hidden="true" />
        </div>
        <span className="text-sm font-semibold tracking-wide text-ink-primary">LOGSTREAM</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                isActive
                  ? 'bg-brand/10 text-brand'
                  : 'text-ink-secondary hover:bg-surface-2 hover:text-ink-primary'
              }`
            }
          >
            <Icon size={16} aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-surface-border">
        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-ink-secondary hover:bg-surface-2 hover:text-ink-primary transition-colors">
          <Settings size={16} aria-hidden="true" />
          Settings
        </button>
      </div>
    </aside>
  );
}
