import type { Page } from '@playwright/test'
import { whenMocked } from '@tests/e2e/helpers/whenMocked'

/**
 * mockBugsnag
 *
 * Mock para Bugsnag error tracking que Netlify inyecta en deploys de preview.
 * Bloquea (abort) las peticiones a sessions.bugsnag.com para evitar bloqueos en Firefox.
 */
export const mockBugsnag = whenMocked(async (page: Page) => {
  // Bloquear peticiones POST a sessions.bugsnag.com
  await page.route('**/sessions.bugsnag.com/**', route => route.abort())
  // Bloquear script de Bugsnag
  await page.route('**/cdn.bugsnag.com/**', route => route.abort())
})
