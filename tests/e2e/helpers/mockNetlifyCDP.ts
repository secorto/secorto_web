import type { Page } from '@playwright/test'
import { whenMocked } from '@tests/e2e/helpers/whenMocked'

/**
 * mockNetlifyCDP
 *
 * Mock para Netlify CDP (Customer Data Platform) analytics que Netlify inyecta
 * en deploys de preview. Bloquea (abort) las peticiones para evitar lentitudes.
 */
export const mockNetlifyCDP = whenMocked(async (page: Page) => {
  // Bloquear peticiones a app.netlify.com/access-control/bb-api
  await page.route('**/app.netlify.com/access-control/bb-api/**', route => route.abort())
  // Bloquear peticiones genéricas a app.netlify.com
  await page.route('**/app.netlify.com/**', route => route.abort())
})
