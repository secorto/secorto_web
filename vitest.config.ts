import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: [
        'apps/*/src/**/*.{ts,tsx,js,jsx,vue}',
        'packages/*/src/**/*.{ts,tsx,js,jsx,vue}',
      ],
      exclude: [
        '**/tests/**',
        '**/coverage/**',
        'apps/*/src/content.config.ts',
        'apps/*/src/env.d.ts',
        'apps/*/src/pages/**',
        'apps/*/src/scripts/**',
      ],
    },
    projects: [
      'apps/*',
      'packages/*',
    ],
  },
})
