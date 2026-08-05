import type { Page } from '@playwright/test'
import { mockGiscus } from './mockGiscus'
import { mockYouTube } from './mockYouTube'
import { mockSlides } from './mockSlides'
import { mockBugsnag } from './mockBugsnag'
import { mockNetlifyCDP } from './mockNetlifyCDP'

/**
 * mockThirdParty
 *
 * Aplica todos los mocks de terceros de forma secuencial.
 * Evita Promise.all para prevenir race conditions en Firefox con networkidle.
 *
 * - YouTube (reproductor embebido)
 * - Slides (OneDrive, Google Slides, etc.)
 * - Giscus (comentarios)
 * - Bugsnag (error tracking inyectado por Netlify)
 * - Netlify CDP (analytics inyectado por Netlify)
 *
 * Uso:
 *   await mockThirdParty(page)
 */
export async function mockThirdParty(page: Page): Promise<void> {
  await mockGiscus(page)
  await mockYouTube(page)
  await mockSlides(page)
  await mockBugsnag(page)
  await mockNetlifyCDP(page)
}
