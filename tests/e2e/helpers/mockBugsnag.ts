import type { Page } from '@playwright/test'
import { whenMocked } from '@tests/e2e/helpers/whenMocked'

/**
 * mockBugsnag
 *
 * Mock para Bugsnag error tracking que Netlify inyecta en deploys de preview.
 * Mockea las peticiones a sessions.bugsnag.com para evitar bloqueos en Firefox.
 */
export const mockBugsnag = whenMocked(async (page: Page) => {
  // Mockear peticiones POST a sessions.bugsnag.com
  await page.route('**/sessions.bugsnag.com/**', route => {
    return route.fulfill({
      status: 202,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    })
  })

  // Mockear script de Bugsnag si es cargado dinámicamente
  await page.route('**/cdn.bugsnag.com/**', route => {
    return route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: '/* Bugsnag mocked */',
    })
  })
})
