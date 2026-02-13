import type { Page } from '@playwright/test'
import { whenMocked } from '@tests/e2e/helpers/whenMocked'

/**
 * mockYouTube
 *
 * Intercepta requests a youtube.com/embed/* y devuelve un iframe
 * liviano con un placeholder. Evita cargar el reproductor completo
 * de YouTube en tests.
 *
 *   await mockYouTube(page)
 */
export const mockYouTube = whenMocked(async (page: Page) => {
  await page.route('**/youtube.com/embed/**', route => {
    return route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: `<!doctype html>
<html><body style="margin:0;display:flex;align-items:center;justify-content:center;background:#000;color:#fff;font-family:sans-serif">
  <p>YouTube mock</p>
</body></html>`
    })
  })
})
