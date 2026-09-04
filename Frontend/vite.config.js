import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite dev server: proxies REST + WebSocket calls to the Spring Boot backend
// so the React app can call relative paths like /api/logs and /ws/logs.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://localhost:8081',
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
