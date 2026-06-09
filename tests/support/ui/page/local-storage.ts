import type { Page } from "@playwright/test"
import { step } from "@tests/fixtures"

/**
 * Asserts that a given key in localStorage has the expected value,
 * by polling until the condition is met or a timeout is reached.
 * Useful for validating that changes to localStorage (like theme or locale) are persisted correctly.
 * @param page Page for validation
 * @param key key to find in local storage
 * @param value expected value to find in local storage
 * @param timeout timeout for polling
 * @param interval interval of polling
 * @returns step for validating local storage
 */
export function shouldHaveLocalStorage(page: Page, key: string, value: string | null, timeout = 2000, interval = 100) {
  return step(`localStorage ${key} should be ${String(value)}`, async ({ expect }) => {
    await expect.poll(() => page.evaluate((k: string) => window.localStorage.getItem(k), key), { timeout, intervals: [interval] }).toBe(value)
  })
}

/**
 * Pre-sets entries in localStorage before the page is loaded. Useful for testing persistence of values like theme or locale.
 * @param page Playwright page
 * @param entries entries to setup in local storage
 * @returns step for init scripts with predefined local storage values
 */
export function injectStorageEntries(page: Page, entries: Record<string, string | null>) {
  return step(`inject storage entries ${JSON.stringify(entries)}`, async () => {
    await page.addInitScript((e: Record<string, string | null>) => {
      try {
        for (const [k, v] of Object.entries(e)) {
          if (v === null) window.localStorage.removeItem(k)
          else window.localStorage.setItem(k, v)
        }
      } catch (err) {
        throw new Error(`Failed to set localStorage entries: ${err instanceof Error ? err.message : String(err)}`)
      }
    }, entries)
  })
}

/**
 * Pre-sets the theme in localStorage before the page is loaded.
 * @param theme Theme for startup
 * @returns Function for injecting the theme entry in localStorage, to be used as preAct in visit() when navigating to a page
 */
export function withThemeInStorage(theme: string) {
  return (page: Page) => injectStorageEntries(page, { theme })
}
