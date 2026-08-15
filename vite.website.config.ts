import { defineConfig } from 'vite'

export default defineConfig({
  root: 'website',
  base: '/bronom/',
  build: {
    outDir: '../docs',
    emptyOutDir: true,
    sourcemap: true
  }
})
