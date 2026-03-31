import { defineConfig } from '@playwright/test'

const baseUrl = process.env.NETLIFY_PREVIEW_URL || process.env.BASE_URL || 'http://localhost:4321'

export default defineConfig({
  testDir: '.',
  reporter: 'list',
  use: {
    baseURL: baseUrl,
  },
  workers: 1,
})
