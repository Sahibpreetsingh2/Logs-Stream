import { useEffect, useRef, useState } from 'react';
import { createLogSocket } from '../api/websocketService';

/**
 * Subscribes to the live log WebSocket while `enabled` is true.
 * Keeps the most recent `maxEvents` entries, newest first.
 */
export function useLiveLogs({
  enabled,
  filters,
  maxEvents = 200,
}) {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState('idle');

  const connectionRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      connectionRef.current?.disconnect();
      connectionRef.current = null;
      setStatus('idle');
      return;
    }

    setStatus('connecting');

    connectionRef.current = createLogSocket({
      filters,
      onOpen: () => setStatus('open'),

      onClose: () => setStatus('closed'),

      onError: () => setStatus('closed'),

      onMessage: (logEvent) => {
        setEvents((prev) => [
          logEvent,
          ...prev,
        ].slice(0, maxEvents));
      },
    });

    return () => {
      connectionRef.current?.disconnect();
      connectionRef.current = null;
    };

    // Reconnect when service or level filter changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    enabled,
    filters.serviceName,
    filters.level,
  ]);

  const clear = () => {
    setEvents([]);
  };

  return {
    events,
    status,
    clear,
  };
}