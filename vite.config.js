import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Forward /api calls to the local server so the browser never needs the API key.
export default defineConfig({ plugins: [react()], server: { proxy: { '/api': 'http://localhost:8787' } } })
