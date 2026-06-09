import type { Page } from '@playwright/test'
import { step } from '@tests/fixtures'

export class PageHelper {
  constructor(readonly page: Page) {}

  shouldHaveURL(expected: string | RegExp) {
    return step(`page should have url ${expected}`, async ({ expect }) => {
      await expect(this.page).toHaveURL(expected)
    })
  }

  shouldHaveTitle(expected: RegExp = /SeCOrTo/) {
    return step(`page should have title ${expected}`, async ({ expect }) => {
      await expect(this.page).toHaveTitle(expected)
    })
  }

  shouldHaveLocalStorage(key: string, value: string | null, timeout = 2000, interval = 100) {
    return step(`localStorage ${key} should be ${String(value)}`, async ({ expect }) => {
      await expect.poll(() => this.page.evaluate((k: string) => window.localStorage.getItem(k), key), { timeout, intervals: [interval] }).toBe(value)
    })
  }

  injectStorageEntries(entries: Record<string, string | null>) {
    return step(`inject storage entries ${JSON.stringify(entries)}`, async () => {
      await this.page.addInitScript((e: Record<string, string | null>) => {
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
}

export function pageHelper(page: Page) {
  return new PageHelper(page)
}
