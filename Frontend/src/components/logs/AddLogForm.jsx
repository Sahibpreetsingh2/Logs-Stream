import React, { useState } from 'react';
import { addLog } from '../../api/logService';

const LEVELS = ['INFO', 'WARN', 'ERROR'];

export default function AddLogForm({ onAdded }) {
  const [service, setService] = useState('');
  const [level, setLevel] = useState('INFO');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!message.trim() || !service.trim()) {
      setError('Service name and message are required.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const saved = await addLog({
        timestamp: new Date().toISOString(),
        level,
        service,
        message,
      });

      setMessage('');
      onAdded?.(saved);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        (typeof err.response?.data === 'string'
          ? err.response.data
          : 'Failed to add log.')
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="panel panel-padded"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <p className="panel-title">Add Log Entry</p>

      {error && (
        <div className="panel-error">
          {error}
        </div>
      )}

      <div className="filter-group">
        <label>Service Name</label>

        <input
          className="input"
          value={service}
          onChange={(e) => setService(e.target.value)}
          placeholder="e.g. payment-service"
        />
      </div>

      <div className="filter-group">
        <label>Level</label>

        <div className="level-toggle-row">
          {LEVELS.map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setLevel(lvl)}
              className={`level-toggle${
                level === lvl ? ' active' : ''
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label>Message</label>

        <input
          className="input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Log message"
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={submitting}
      >
        {submitting ? 'Adding…' : 'Add Log'}
      </button>
    </form>
  );
}