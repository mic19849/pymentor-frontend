import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  root: '.', // Ensure root is the client directory
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    host: true, // Allow access from external devices
    allowedHosts: [
      '.ngrok-free.app' // Allow all ngrok URLs like *.ngrok-free.app
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
  }
})
