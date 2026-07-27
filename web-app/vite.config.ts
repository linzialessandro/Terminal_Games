/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  base: '/Terminal_Games/', // Repository name (GitHub Pages)
  plugins: [
    react(),
    {
      // GitHub Pages serves 404.html for unknown paths — copy SPA shell so deep links work.
      name: 'spa-github-pages-fallback',
      closeBundle() {
        const outDir = resolve(__dirname, 'dist')
        const index = resolve(outDir, 'index.html')
        const fallback = resolve(outDir, '404.html')
        if (existsSync(index)) {
          copyFileSync(index, fallback)
        }
      },
    },
  ],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
