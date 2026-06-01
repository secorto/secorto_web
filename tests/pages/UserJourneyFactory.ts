import type { Page } from '@playwright/test'
import { step } from '@tests/fixtures'
import { mockThirdParty } from '@tests/e2e/helpers/mockThirdParty'

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
      await page.goto(url)
      await mockThirdParty(page)
      return factory(page)
    })
