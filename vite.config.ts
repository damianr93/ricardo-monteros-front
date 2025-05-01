import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    // Opción 1: habilitar explícitamente tu túnel ngrok
    allowedHosts: [
      '59d1-98-97-134-78.ngrok-free.app'
    ],
  }
}

)