import React from 'react';

export default function LogDetailModal({ log, onClose }) {
  if (!log) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="panel modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="modal-timestamp">
              Score: {log.score != null ? log.score.toFixed(3) : '—'}
            </p>
          </div>
          <button onClick={onClose} className="modal-close">✕</button>
        </div>

        <div>
          <p className="modal-message-label">Message</p>
          <pre className="modal-message-body">{log.message}</pre>
        </div>
      </div>
    </div>
  );
}