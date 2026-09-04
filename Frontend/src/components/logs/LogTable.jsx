import React, { useState } from 'react';
import LogDetailModal from './LogDetailModal.jsx';

export default function LogTable({ logs, loading, error, page, totalPages, onPageChange }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="panel">
      <div className="table-wrap">
        <table className="log-table">
          <thead>
            <tr>
              <th>Message</th>
              <th className="align-right">Score</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={2} className="table-empty-state">Loading logs…</td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={2} className="table-error-state">{error}</td>
              </tr>
            )}

            {!loading && !error && logs.length === 0 && (
              <tr>
                <td colSpan={2} className="table-empty-state">
                  No logs match this search. Try a different keyword.
                </td>
              </tr>
            )}

            {!loading && !error && logs.map((log, i) => (
              <tr key={i} onClick={() => setSelected(log)}>
                <td className="message">{log.message}</td>
                <td className="response-time mono">
                  {log.score != null ? log.score.toFixed(2) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <p className="table-footer-label">Page {page + 1} of {Math.max(totalPages, 1)}</p>
        <div className="table-footer-actions">
          <button
            disabled={page === 0}
            onClick={() => onPageChange(page - 1)}
            className="btn btn-outline btn-sm"
          >
            Previous
          </button>
          <button
            disabled={page + 1 >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="btn btn-outline btn-sm"
          >
            Next
          </button>
        </div>
      </div>

      <LogDetailModal log={selected} onClose={() => setSelected(null)} />
    </div>
  );
}