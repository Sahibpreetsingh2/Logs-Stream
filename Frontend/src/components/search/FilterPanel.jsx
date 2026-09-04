import React from 'react';

const LEVELS = ['', 'INFO', 'WARN', 'ERROR'];

export default function FilterPanel({ filters, onChange, onReset }) {
  function toLocalInputValue(iso) {
    if (!iso) return '';
    return iso.slice(0, 16); // 'YYYY-MM-DDTHH:mm'
  }

  return (
    <div className="panel panel-padded filter-panel">
      <p className="panel-title">Filters</p>

      <div className="filter-group">
        <label>Service Name</label>

        <input
          type="text"
          value={filters.serviceName}
          onChange={(e) =>
            onChange({ serviceName: e.target.value })
          }
          className="input"
          placeholder="e.g. payment-service"
        />
      </div>

      <div className="filter-group">
        <label>Level</label>

        <div className="level-toggle-row">
          {LEVELS.map((lvl) => (
            <button
              key={lvl || 'ALL'}
              type="button"
              onClick={() => onChange({ level: lvl })}
              className={`level-toggle${
                filters.level === lvl ? ' active' : ''
              }`}
            >
              {lvl || 'ALL'}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label>Start Time</label>

        <input
          type="datetime-local"
          value={toLocalInputValue(filters.startTime)}
          onChange={(e) =>
            onChange({
              startTime: e.target.value
                ? new Date(e.target.value).toISOString()
                : null,
            })
          }
          className="input"
        />
      </div>

      <div className="filter-group">
        <label>End Time</label>

        <input
          type="datetime-local"
          value={toLocalInputValue(filters.endTime)}
          onChange={(e) =>
            onChange({
              endTime: e.target.value
                ? new Date(e.target.value).toISOString()
                : null,
            })
          }
          className="input"
        />
      </div>

      <button
        type="button"
        onClick={onReset}
        className="btn btn-outline"
        style={{ width: '100%' }}
      >
        Reset filters
      </button>
    </div>
  );
}