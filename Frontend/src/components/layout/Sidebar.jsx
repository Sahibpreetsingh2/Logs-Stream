import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard', icon: '◱' },
  { to: '/search', label: 'Search', icon: '⌕' },
  { to: '/live', label: 'Live Tail', icon: '●' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <span className="sidebar-brand-mark">▍</span>
          <span className="sidebar-brand-name">LogScope</span>
        </div>
        <p className="sidebar-subtitle">Log search &amp; monitoring</p>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <span className="sidebar-link-icon">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">Connected to Spring Boot API (port 8081)</div>
    </aside>
  );
}
