import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// LogStream frontend dev server.
// The backend (Spring Boot) runs on :8081. Axios uses VITE_API_BASE_URL directly
// (see src/api/axiosClient.ts), so a proxy isn't required, but is left here
// commented out in case you prefer proxying /api during local development.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:8081',
    //     changeOrigin: true,
    //   },
    // },
  },
});
