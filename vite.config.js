import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  root: "./",
  server: {
    port: 4173,
    proxy: {
      "/api": {
        target: "https://gambitstorage.azurewebsites.net",
        changeOrigin: true,
      },
    }
  },
  plugins: [react()],
})
