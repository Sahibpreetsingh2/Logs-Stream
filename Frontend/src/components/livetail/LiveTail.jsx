import React, { useState } from 'react';
import dayjs from 'dayjs';
import { useLiveLogs } from '../../hooks/useWebSocket.js';

const STATUS_COPY = {
  idle: { label: 'Paused', dotClass: 'idle' },
  connecting: { label: 'Connecting…', dotClass: 'connecting' },
  open: { label: 'Live', dotClass: 'open' },
  closed: { label: 'Reconnecting…', dotClass: 'closed' },
};

export default function LiveTail({ serviceName, level }) {
  const [enabled, setEnabled] = useState(true);

  const { events, status, clear } = useLiveLogs({
    enabled,
    filters: { serviceName, level },
    maxEvents: 300,
  });

  const statusInfo = STATUS_COPY[status] || STATUS_COPY.idle;

  return (
    <div className="panel live-tail">
      <div className="live-tail-header">

        <div className="live-tail-status">
          <span
            className={`status-dot ${statusInfo.dotClass}`}
          />

          <span className="live-tail-status-label">
            {statusInfo.label}
          </span>

          <span className="live-tail-count">
            {events.length} events buffered
          </span>
        </div>

        <div className="live-tail-actions">

          <button
            onClick={() => setEnabled((v) => !v)}
            className="btn btn-outline btn-sm"
          >
            {enabled ? 'Pause' : 'Resume'}
          </button>

          <button
            onClick={clear}
            className="btn btn-outline btn-sm"
          >
            Clear
          </button>

        </div>
      </div>

      <div className="live-tail-body">

        {events.length === 0 && (
          <div className="live-tail-empty">
            Waiting for new log events…
          </div>
        )}

        {events.map((log, i) => (
          <div
            key={log.id ?? i}
            className="live-tail-row"
          >

            <span className="live-tail-row-time">
              {log.timestamp
                ? dayjs(log.timestamp).format('HH:mm:ss.SSS')
                : '--:--:--'}
            </span>

            <span
              className={`level-pill level-${log.level}`}
            >
              {log.level}
            </span>

            <span className="live-tail-row-service">
              {log.serviceName}
            </span>

            <span className="live-tail-row-message">
              {log.message}
            </span>

          </div>
        ))}

      </div>
    </div>
  );
}