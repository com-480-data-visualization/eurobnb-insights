import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/eurobnb-insights/', // Must match your EXACT repo name
  build: {
    outDir: 'dist',
    assetsDir: 'assets' // This is default
  }
})