import type { Page } from '@playwright/test'
import { whenMocked } from '@tests/e2e/helpers/whenMocked'

/**
 * mockSlides
 *
 * Intercepta requests a proveedores de presentaciones embebidas
 * (OneDrive, Google Slides, SlideShare, Speaker Deck, Slides.com)
 * y devuelve un HTML liviano. Evita cargar el visor completo en tests.
 *
 *   await mockSlides(page)
 */
export const mockSlides = whenMocked(async (page: Page) => {
  const slidePatterns = [
    '**/onedrive.live.com/embed**',
    '**/docs.google.com/presentation/**',
    '**/slideshare.net/**',
    '**/speakerdeck.com/**',
    '**/slides.com/**',
  ]

  for (const pattern of slidePatterns) {
    await page.route(pattern, route => {
      return route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: `<!doctype html>
<html><body style="margin:0;display:flex;align-items:center;justify-content:center;background:#f5f5f5;color:#333;font-family:sans-serif">
  <p>Slides mock</p>
</body></html>`
      })
    })
  }
})
