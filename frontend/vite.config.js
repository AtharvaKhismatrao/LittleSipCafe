import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/menu': 'http://localhost:5000',
      '/reservations': 'http://localhost:5000',
      '/reviews': 'http://localhost:5000',
      '/orders': 'http://localhost:5000',
      '/auth': 'http://localhost:5000',
      '/health': 'http://localhost:5000',
    },
  },
});
