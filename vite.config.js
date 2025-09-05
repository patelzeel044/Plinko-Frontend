import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    proxy: {
     '/api':process.env.VITE_BACKEND_URL || process.env.BACKEND_URL
    }
  },
  resolve: {
    alias: {
      "@": `${__dirname}/src`,   // optional path alias
    },
  },
})
