import type { Page } from '@playwright/test'

/**
 * whenMocked
 *
 * Decorador simple que ejecuta el mock solo si la política lo permite:
 * - Si `process.env.REAL_THIRD_PARTY === 'true'` => no hace nada
 * - En cualquier otro caso => ejecuta la función mock pasada
 *
 * Firma: (fn: (page: Page) => Promise<void>) => (page: Page) => Promise<void>
 */
export function whenMocked(fn: (page: Page) => Promise<void>) {
  return async (page: Page) => {
    if (process.env.REAL_THIRD_PARTY === 'true') return
    await fn(page)
  }
}
