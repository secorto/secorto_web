import type { Page } from '@playwright/test'
import { whenMocked } from '@tests/e2e/helpers/whenMocked'

/**
 * mockNetlifyCDP
 *
 * Mock para Netlify CDP (Customer Data Platform) analytics que Netlify inyecta
 * en deploys de preview. Mockea las peticiones que pueden ser lentas.
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
