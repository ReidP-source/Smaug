import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Bind to all network interfaces
    port: 5177,      // Use the port that's actually working (5177)
    allowedHosts: ['classwork.engr.oregonstate.edu'], // Allow domain access
    // Alternative: you could use 'all' to allow any host
    // allowedHosts: 'all',
  }
})