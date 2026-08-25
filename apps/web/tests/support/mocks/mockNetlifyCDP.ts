import type { Page } from '@playwright/test'
import { whenMocked } from '@tests/e2e/helpers/whenMocked'

/**
 * mockNetlifyCDP
 *
 * Mock para Netlify CDP (Customer Data Platform) analytics que Netlify inyecta
 * en deploys de preview. Simula respuestas vacías en lugar de abortar para mejor compatibilidad con Firefox en Playwright 1.61.1+
 */
export const mockNetlifyCDP = whenMocked(async (page: Page) => {
  // Mockear peticiones a app.netlify.com/access-control/bb-api
  await page.route('**/app.netlify.com/access-control/bb-api/**', route => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: [] }),
    })
  })

  // Mockear peticiones genéricas a app.netlify.com
  await page.route('**/app.netlify.com/**', route => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({}),
    })
  })
})
