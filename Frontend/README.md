# LogScope — React Frontend

Member 4's piece of the log platform: Dashboard, Search, Filters, Log Table, Live Tail (WebSocket), ECharts graphs — talking to the Java Spring Boot backend over REST + WebSocket.

## 1. Setup

```bash
npm install
npm run dev
```

Runs on `http://localhost:5173`. The Vite dev server proxies:
- `/api/*` → `http://localhost:8081` (your Spring Boot REST API — matches the Tomcat port in your backend logs)
- `/ws/*` → `ws://localhost:8081` (your WebSocket endpoint)

Note: your backend also runs a gRPC server on port `9090` (`o.s.grpc.server.NettyGrpcServerFactory`). The frontend never talks to gRPC directly — that's internal to the backend (e.g. backend ↔ Lucene search service). React only calls the REST/WebSocket surface Spring Boot exposes on 8081.

Change these targets in `vite.config.js` if your backend runs elsewhere. For a production build, set `VITE_API_BASE_URL` and `VITE_WS_BASE_URL` in a `.env` file instead of relying on the proxy.

## 2. Folder structure

```
src/
  api/
    axiosClient.js        # shared axios instance, auth header, error interceptor
    logService.js         # all REST calls (search, stats, services list, alerts)
    websocketService.js   # native WebSocket wrapper w/ auto-reconnect, used by Live Tail
  context/
    LogFilterContext.jsx  # global filter state shared by Search page
  hooks/
    useLogSearch.js       # calls logService.searchLogs whenever filters change
    useWebSocket.js        # subscribes/unsubscribes to the live log stream
  components/
    layout/                Sidebar, Navbar
    dashboard/              StatsCards, LogVolumeChart, LogLevelChart, TopServicesChart (ECharts)
    search/                 SearchBar, FilterPanel (service/level/time range)
    logs/                   LogTable, LogDetailModal
    livetail/               LiveTail (WebSocket-driven scrolling view)
  pages/
    Dashboard.jsx
    SearchPage.jsx
    LiveTailPage.jsx
  App.jsx                  # router shell
  main.jsx                 # entry point
```

## 3. Backend contract this frontend expects

These are the endpoints the frontend calls today — adjust paths in `logService.js` / `websocketService.js` to match your actual `@RestController` / `@Controller` mappings once gRPC, Lucene search, and alerting are wired up on the backend, per the recommended build order.

### REST (`logService.js`)

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/logs/search` | Body: `{ keyword, serviceName, level, startTime, endTime, page, size }` → `{ content, totalElements, totalPages }` |
| GET | `/api/logs/{id}` | Single log entry detail |
| GET | `/api/logs/services` | `string[]` of distinct service names, for the filter dropdown |
| GET | `/api/logs/stats/summary` | `{ total, info, warn, error, avgResponseTimeMs }` |
| GET | `/api/logs/stats/volume?interval=1h` | `[{ bucket, info, warn, error }]` time series |
| GET | `/api/logs/stats/by-level` | `[{ level, count }]` |
| GET | `/api/logs/stats/by-service` | `[{ serviceName, count, errorCount }]` |
| GET | `/api/alerts/active` | Currently firing alerts. Shape: `{ id, ruleName, serviceName, level, matches, threshold, notifyVia, triggeredAt }` — matches the `AlertChecker` / `WebhookNotificationService` output seen in the backend logs (e.g. rule `high-error-rate` on `payment-service`, 3/3 matches). Polled every 10s from the Dashboard's new **Active Alerts** panel. |

### Log entry shape

```json
{
  "id": "log-abc123",
  "timestamp": "2026-08-19T10:15:32.101Z",
  "serviceName": "order-service",
  "level": "ERROR",
  "message": "NullPointerException at OrderProcessor.java:88",
  "responseTimeMs": 412,
  "traceId": "trace-9f2c..."
}
```

### WebSocket (`websocketService.js`)

Connects to `/ws/logs?serviceName=...&level=...`. Backend pushes one JSON log entry (same shape as above) per message as new logs arrive. Reconnects automatically with exponential backoff if the connection drops.

If your backend uses STOMP/SockJS instead of a raw WebSocket, swap the implementation inside `createLogSocket()` — `useWebSocket.js` and `LiveTail.jsx` only depend on the `{ onOpen, onMessage, onClose, onError, disconnect }` contract, not the transport.

## 4. Styling

Plain CSS only — no Tailwind, no CSS-in-JS. Everything lives in `src/styles/index.css`, using CSS custom properties (`:root` variables) for the palette so a theme change is a one-file edit. Class names are semantic (`.panel`, `.level-pill`, `.stat-card`, `.live-tail-row`, etc.) rather than utility classes.

## 5. Suggested next steps

1. Confirm the JSON shapes above match your Spring Boot DTOs; adjust `logService.js` field names if they differ (e.g. `serviceName` vs `service`).
2. Wire real auth (JWT/session) into `axiosClient.js`'s request interceptor.
3. If your `AlertChecker` re-fires the same rule on every poll cycle (as seen in the backend log) rather than only on new matches, consider de-duplicating on the backend or having the frontend collapse repeats by `ruleName` + `serviceName` before rendering.
