import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  test: {
    globals: true,
    setupFiles: ['./src/tests/setup-unit.ts'],
  },
})
