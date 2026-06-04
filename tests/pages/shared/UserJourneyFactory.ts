import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { step } from '@tests/fixtures'
import { mockThirdParty } from '@tests/e2e/helpers/mockThirdParty'
import { homePath } from '@tests/pages/shared/NavigationPaths'

export type JourneyFactory<T> = (page: Page) => T | Promise<T>

export const visit = <T>(
  title: string,
  page: Page,
  url: string,
  factory: JourneyFactory<T>,
  preAct?: (page: Page) => Promise<void> | void,
) =>
    step(title, async () => {
      if (preAct) await preAct(page)
      await mockThirdParty(page)
      await page.goto(url)
      return factory(page)
    })

export const userInHomeFactory = <T>(
  title: string,
  page: Page,
  locale: UILanguages,
  factory: JourneyFactory<T>,
  preAct?: (page: Page) => Promise<void> | void,
) => visit(title, page, homePath(locale), factory, preAct)
