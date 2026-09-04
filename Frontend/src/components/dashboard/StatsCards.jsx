import React from 'react';

const CARD_CONFIG = [
  { key: 'totalLogsProcessed', label: 'Total Logs', accent: 'text-ink' },
  { key: 'info', label: 'Info', accent: 'text-info' },
  { key: 'warn', label: 'Warnings', accent: 'text-warn' },
  { key: 'error', label: 'Errors', accent: 'text-error' },
];

export default function StatsCards({ stats, loading }) {
  return (
    <div className="stats-grid">
      {CARD_CONFIG.map(({ key, label, accent }) => {
        let value = stats?.[key];

        // INFO, WARN and ERROR counts come from countsByLevel
        if (key === 'info') {
          value = stats?.countsByLevel?.INFO;
        }

        if (key === 'warn') {
          value = stats?.countsByLevel?.WARN;
        }

        if (key === 'error') {
          value = stats?.countsByLevel?.ERROR;
        }

        return (
          <div key={key} className="stat-card">
            <p className="stat-card-label">{label}</p>

            <p className={`stat-card-value ${accent}`}>
              {loading
                ? '—'
                : (value ?? 0).toLocaleString()}
            </p>
          </div>
        );
      })}

      <div className="stat-card stat-card-wide">
        <div>
          <p className="stat-card-label">Avg Response Time</p>

          <p className="stat-card-value text-ok">
            {loading
              ? '—'
              : `${stats?.averageProcessingTimeMs ?? 0} ms`}
          </p>
        </div>
      </div>
    </div>
  );
}