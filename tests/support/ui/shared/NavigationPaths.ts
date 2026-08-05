import type { UILanguages } from '@i18n/ui'
import type { Page } from '@playwright/test'
import { step } from '@tests/fixtures'
import { mockThirdParty } from '@tests/e2e/helpers/mockThirdParty'

export function homePath(locale: UILanguages) {
  return `/${locale}/`
}

export function tagsPath(locale: UILanguages) {
  return `/${locale}/tags`
}

export const visit = <T>(
  title: string,
  page: Page,
  url: string,
  factory: (page: Page) => T | Promise<T>,
  preAct?: (page: Page) => Promise<void> | void,
) =>
    step(title, async () => {
      if (preAct) await preAct(page)
      await mockThirdParty(page)
      await page.goto(url, { waitUntil: 'domcontentloaded' })
      return factory(page)
    })
