import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync } from 'node:fs';
import { resolve } from 'path';
const keyPath = resolve(__dirname, './cert/localhost+3-key.pem');
const certPath = resolve(__dirname, './cert/localhost+3.pem');

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],  
  server:{
    https: {
      key:  readFileSync(keyPath),
      cert: readFileSync(certPath )
    },
    port: 5173,
    host: '0.0.0.0', // cambiar a '0.0.0.0' o localhost
    strictPort: true,
    hmr: {
      protocol: 'wss',
      host: 'localhost'
    }
  }
})
