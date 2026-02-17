import { getViteConfig } from 'astro/config';
import { resolve } from 'path'
import { fileURLToPath } from 'url'

// ESM-safe project root derived from this config file's URL
const PROJECT_ROOT = fileURLToPath(new URL('.', import.meta.url))

export default getViteConfig({
  resolve: {
    alias: {
      '@assets': resolve(PROJECT_ROOT, 'src/assets'),
      '@components': resolve(PROJECT_ROOT, 'src/components'),
      '@config': resolve(PROJECT_ROOT, 'src/config'),
      '@i18n': resolve(PROJECT_ROOT, 'src/i18n'),
      '@layouts': resolve(PROJECT_ROOT, 'src/layouts'),
      '@utils': resolve(PROJECT_ROOT, 'src/utils'),
      '@tests': resolve(PROJECT_ROOT, 'tests'),
      '@github': resolve(PROJECT_ROOT, '.github'),
    }
  },
  test: {
    include: ['tests/unit/**/*.test.ts'],
    setupFiles: ['tests/setup.ts'],
    coverage: {
      reporter: ['text', 'lcov'],
      include: ['src/**/*.{ts,tsx,js,jsx,vue}','.github/**/*.{ts,tsx,js,jsx,vue}'],
      exclude: [
        'src/content.config.ts',
        'src/env.d.ts',
        'src/pages/**',          // Endpoints Astro → testear con Playwright e2e
        'src/scripts/**',        // Browser scripts → testear con Playwright e2e
        'src/i18n/translations.ts', // Barrel de datos precomputados (buildTranslationMap ya testeado)
      ],
    }
  }
})
