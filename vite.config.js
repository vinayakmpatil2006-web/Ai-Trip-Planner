import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      // Proxy /places-api/* → https://maps.googleapis.com/maps/api/*
      // This lets us call Google Places REST API from the browser without CORS errors.
      '/places-api': {
        target: 'https://maps.googleapis.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/places-api/, '/maps/api'),
      },
    },
  },
})

