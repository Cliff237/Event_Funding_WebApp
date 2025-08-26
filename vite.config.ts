
import { defineConfig } from 'vite'
import svgr from '@svgr/rollup'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr(),
  ],
})