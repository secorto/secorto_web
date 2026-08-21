import { defineConfig } from 'vitest/config'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const PROJECT_ROOT = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '@secorto/step': resolve(PROJECT_ROOT, 'src'),
      '@secorto/step/adapter': resolve(PROJECT_ROOT, 'src/adapter.ts'),
      '@secorto/step/playwright': resolve(PROJECT_ROOT, 'src/playwright.ts'),    },
  },
  test: {
    include: ['tests/**/*.test.ts'],
  },
})
