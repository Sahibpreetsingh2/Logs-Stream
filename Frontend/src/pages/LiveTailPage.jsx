import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar.jsx';
import LiveTail from '../components/livetail/LiveTail.jsx';

const LEVELS = ['', 'INFO', 'WARN', 'ERROR'];

export default function LiveTailPage() {
  const [serviceName, setServiceName] = useState('');
  const [level, setLevel] = useState('');

  return (
    <div>
      <Navbar title="Live Tail" subtitle="Real-time log stream over WebSocket" />
      <div className="page-body">
        <div className="live-filter-bar">
          <input
            type="text"
            placeholder="Filter by service name…"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            className="input live-filter-input"
          />
          <div className="level-toggle-row" style={{ flex: '0 0 auto' }}>
            {LEVELS.map((lvl) => (
              <button
                key={lvl || 'ALL'}
                onClick={() => setLevel(lvl)}
                className={`level-toggle${level === lvl ? ' active' : ''}`}
              >
                {lvl || 'ALL'}
              </button>
            ))}
          </div>
        </div>

        <LiveTail serviceName={serviceName} level={level} />
      </div>
    </div>
  );
}
