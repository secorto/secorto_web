import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@assets': resolve(__dirname, 'src/assets'),
      '@components': resolve(__dirname, 'src/components'),
      '@config': resolve(__dirname, 'src/config'),
      '@i18n': resolve(__dirname, 'src/i18n'),
      '@layouts': resolve(__dirname, 'src/layouts'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@tests': resolve(__dirname, 'tests'),
      '@github': resolve(__dirname, '.github'),
    }
  },
  test: {
    include: ['tests/unit/**/*.test.ts'],
    coverage: {
      reporter: ['text', 'lcov'],
    }
  }
})
