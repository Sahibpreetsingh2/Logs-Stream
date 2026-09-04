import React from 'react';
import dayjs from 'dayjs';

const LEVEL_ICON = {
  ERROR: '✕',
  WARN: '▲',
  INFO: 'ℹ',
};

// alerts format:
// [
//   {
//     id,
//     ruleName,
//     serviceName,
//     level,
//     matches,
//     threshold,
//     notifyVia,
//     triggeredAt
//   }
// ]

export default function AlertsPanel({
  alerts = [],
  loading = false,
  error = null,
}) {
  return (
    <div className="panel panel-padded">

      {/* Header */}
      <div className="alerts-panel-header">
        <p
          className="panel-title"
          style={{ margin: 0 }}
        >
          Active Alerts
        </p>

        {alerts.length > 0 && (
          <span className="alert-badge">
            {alerts.length}
          </span>
        )}
      </div>

      {/* Alerts */}
      <div className="alerts-panel">

        {/* Loading */}
        {loading && (
          <div className="alerts-empty">
            Checking alert rules…
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="alerts-empty text-error">
            {error}
          </div>
        )}

        {/* No alerts */}
        {!loading &&
          !error &&
          alerts.length === 0 && (
            <div className="alerts-empty">
              No rules are currently triggered.
            </div>
          )}

        {/* Alert list */}
        {!loading &&
          !error &&
          alerts.length > 0 &&
          alerts.map((alert) => (
            <div
              key={
                alert.id ??
                `${alert.ruleName}-${alert.serviceName}`
              }
              className={`alert-row level-${alert.level}`}
            >

              {/* Level icon */}
              <span className="alert-row-icon">
                {LEVEL_ICON[alert.level] ?? '●'}
              </span>

              {/* Alert information */}
              <div className="alert-row-body">

                <p className="alert-row-title">
                  {alert.ruleName}
                </p>

                <p className="alert-row-meta">
                  {alert.serviceName} · {alert.level}

                  {alert.triggeredAt &&
                    ` · ${dayjs(alert.triggeredAt).format(
                      'HH:mm:ss'
                    )}`}
                </p>

              </div>

              {/* Match / threshold */}
              <span className="alert-row-count">
                {alert.matches ?? 0}/{alert.threshold ?? 0}
              </span>

            </div>
          ))}
      </div>
    </div>
  );
}