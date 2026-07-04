import type { Page } from '@playwright/test'
import { mockGiscus } from './mockGiscus'
import { mockYouTube } from './mockYouTube'
import { mockSlides } from './mockSlides'
import { mockBugsnag } from './mockBugsnag'
import { mockNetlifyCDP } from './mockNetlifyCDP'

/**
 * mockThirdParty
 *
 * Aplica todos los mocks de terceros de una sola vez:
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
  await Promise.all([
    mockGiscus(page),
    mockYouTube(page),
    mockSlides(page),
    mockBugsnag(page),
    mockNetlifyCDP(page),
  ])
}
