/**
 * Thin wrapper around the native WebSocket for the Live Tail feature.
 * Backend is expected to push newline-delimited JSON log events over
 * a plain WebSocket endpoint, one JSON object per message:
 *
 * {
 *   id,
 *   timestamp,
 *   serviceName,
 *   level,
 *   message,
 *   responseTimeMs
 * }
 *
 * If the backend instead uses STOMP/SockJS, swap this out for
 * @stomp/stompjs — the LiveTail component only depends on the
 * onMessage/connect/disconnect contract below, not the transport details.
 */

const DEFAULT_URL =
  import.meta.env.VITE_WS_BASE_URL ||
  'ws://localhost:8081/live-tail';

export function createLogSocket({
  url = DEFAULT_URL,
  filters = {},
  onMessage,
  onOpen,
  onClose,
  onError,
}) {
  let socket = null;
  let reconnectTimer = null;
  let closedByClient = false;
  let attempt = 0;

  function buildUrl() {
    const params = new URLSearchParams();

    if (filters.serviceName) {
      params.set('serviceName', filters.serviceName);
    }

    if (filters.level) {
      params.set('level', filters.level);
    }

    const qs = params.toString();

    return qs ? `${url}?${qs}` : url;
  }

  function connect() {
    closedByClient = false;

    socket = new WebSocket(buildUrl());

    socket.onopen = (e) => {
      attempt = 0;
      onOpen?.(e);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        onMessage?.(data);
      } catch (err) {
        console.error(
          'LiveTail: failed to parse message',
          err,
          event.data
        );
      }
    };

    socket.onerror = (e) => {
      onError?.(e);
    };

    socket.onclose = (e) => {
      onClose?.(e);

      if (!closedByClient) {
        // Exponential backoff, capped at 15 seconds.
        attempt += 1;

        const delay = Math.min(
          15000,
          1000 * 2 ** attempt
        );

        reconnectTimer = setTimeout(connect, delay);
      }
    };
  }

  function disconnect() {
    closedByClient = true;

    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }

    socket?.close();
  }

  connect();

  return {
    disconnect,
  };
}