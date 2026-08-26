import type { UILanguages } from '@i18n/ui'
import type { Page } from '@playwright/test'
import { step, type Step } from '@tests/step'
import { mockThirdParty } from '@tests/support/mocks/mockThirdParty'
import type { Loadable } from '@tests/support/ui/shared/contracts/localization'

export function homePath(locale: UILanguages) {
  return `/${locale}/`
}

export function tagsPath(locale: UILanguages) {
  return `/${locale}/tags`
}

export const visit = <T extends Loadable>(
  title: string,
  page: Page,
  url: string,
  factory: (page: Page) => T | Promise<T> | Step<T>,
  preAct?: (page: Page) => Step<void> | void,
  gotoOptions?: Parameters<Page['goto']>[1],
) =>
    step(title, async () => {
      if (preAct) await preAct(page)
      await mockThirdParty(page)
      await page.goto(url, gotoOptions)
      const pageObject = await factory(page)
      await pageObject.shouldBeLoaded()
      return pageObject
    })
