import { expect, type Page, type TestInfo } from '@playwright/test'
import { step } from '@tests/fixtures'

async function assertNoHorizontalOverflowUtil(page: Page, testInfo?: TestInfo, locale?: string) {
  // Allow layout/paint to settle
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))))

  const overflow = await page.evaluate(() => {
    const maxW = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth)
    const iw = window.innerWidth
    const offenders = Array.from(document.querySelectorAll('*'))
      .filter(el => el.getBoundingClientRect().right > iw + 1)
      .slice(0, 5)
      .map(el => ({ tag: el.tagName, right: Math.round(el.getBoundingClientRect().right), html: el.outerHTML.slice(0, 200) }))
    return { maxW, iw, offenders }
  })

  if (overflow.maxW > overflow.iw) {
    const file = `test-results/horizontal-overflow-${locale ?? 'unknown'}-${Date.now()}.png`
    // Ensure directory exists is left to the CI/runtime; Playwright will create the file path
    await page.screenshot({ path: file, fullPage: true })
    if (testInfo?.attach) {
      try {
        // Attach the screenshot to the Playwright report if possible
        // `attach` expects Buffer or path depending on runner; try both gracefully
        await testInfo.attach('horizontal-overflow-screenshot', { path: file, contentType: 'image/png' })
      } catch {
        // ignore attachment errors; screenshot is still on disk for debugging
      }
    }
  }

  expect(overflow.maxW).toBeLessThanOrEqual(overflow.iw)
}

/**
 * Comprueba que no exista desbordamiento horizontal en la página.
 * - Espera dos frames para que el layout se estabilice
 * - Calcula `scrollWidth` vs `innerWidth`
 * - Si hay overflow, captura un screenshot en `test-results/` y, si se pasa `testInfo`, lo adjunta al informe
 * - Lanza una aserción usando `expect` con información diagnóstica sobre los elementos que provocan overflow
 *
 * @param page Playwright `Page`
 * @param testInfo (opcional) `TestInfo` para adjuntar screenshots en el reporte
 * @param locale (opcional) cadena para incluir en el nombre del screenshot
 */
export function assertNoHorizontalOverflow(page: Page, testInfo?: TestInfo, locale?: string) {
  return step('no horizontal scroll on mobile', async () => {
    await assertNoHorizontalOverflowUtil(page, testInfo, locale)
  })
}
