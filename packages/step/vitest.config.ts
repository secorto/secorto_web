import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@secorto/step': resolve(__dirname, './src/index.ts'),
      '@secorto/step/playwright': resolve(__dirname, './src/playwright.ts'),
    },
  },
  test: {
    include: ['tests/**/*.test.ts'],
  },
})
