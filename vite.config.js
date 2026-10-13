import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Publicado en https://oscarolmosherrero.github.io/mevasa-app/
export default defineConfig({
  base: '/mevasa-app/',
  plugins: [react()],
})
