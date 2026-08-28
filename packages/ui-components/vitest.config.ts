import { defineConfig } from 'vitest/config'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const PROJECT_ROOT = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '@secorto/ui-components': resolve(PROJECT_ROOT, 'src'),
    },
  },
  test: {
    include: ['src/**/*.test.ts'],
  },
})
