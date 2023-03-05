import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import { resolve } from 'path'

import fg from 'fast-glob'

const entries = fg
  .sync('./**/*.html', {
    cwd: __dirname,
    ignore: ['./node_modules/**', './dist/**'],
  })
  .map((entry) => resolve(__dirname, entry))

// https://vitejs.dev/config/
export default defineConfig({
  base: '/jagdai/examples/',
  server: {
    port: 3001,
  },
  plugins: [react(), vanillaExtractPlugin()],
  resolve: {
    alias: {
      jagdai: resolve(__dirname, '../../packages/jagdai/src'),
    },
  },
  build: {
    sourcemap: true,
    outDir: resolve(__dirname, '../examples'),
    rollupOptions: {
      input: entries,
    },
  },
})
