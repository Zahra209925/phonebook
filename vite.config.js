import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // Backendin osoite
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // Poistaa "/api" polusta
      }
    }
  }
});