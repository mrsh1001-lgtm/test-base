import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Vite serves the app on the preview entry port and proxies `/api` to the
 * Express service, so the browser only ever talks to one origin (cookies and
 * form posts stay same-origin).
 */
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: Number(process.env.VITE_PORT ?? 5173),
    strictPort: true,
    proxy: {
      '/api': {
        target: process.env.API_PROXY_TARGET ?? 'http://127.0.0.1:8787',
        changeOrigin: true,
      },
    },
    // Bind mounts in containers do not always emit file events.
    watch: { usePolling: process.env.CHOKIDAR_USEPOLLING === '1' },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
