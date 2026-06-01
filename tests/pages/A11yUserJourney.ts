import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { AxeBuilder } from '@axe-core/playwright'
import { mockThirdParty } from '@tests/e2e/helpers/mockThirdParty'
import { getURLForSection } from '@utils/sections'
import { step } from '@tests/fixtures'

export class A11yUserJourney {
  constructor(readonly page: Page) {}

  auditA11y(excludes?: string[]) {
    return step('audit a11y', async () => {
      const DEFAULT_EXCLUDES = ['[data-netlify-deploy-id]']
      const builder = new AxeBuilder({ page: this.page })
      const exs = excludes ?? DEFAULT_EXCLUDES
      for (const ex of exs) builder.exclude(ex)
      return await builder.analyze()
    })
  }

  shouldPassAudit(results: { violations?: unknown[] }) {
    return step('should pass accessibility audit', async ({ expect }) => {
      await expect(results.violations ?? []).toEqual([])
    })
  }
}

export function userInTalk(page: Page, locale: UILanguages) {
  return step(`a user in talk list ${locale}`, async () => {
    await page.goto(getURLForSection('talk', locale))
    return new A11yUserJourney(page)
  })
}

export function userInTalkTag(page: Page, locale: UILanguages, tag = 'containers') {
  return step(`a user in talk tag ${locale} ${tag}`, async () => {
    const talksTagRoute = `${getURLForSection('talk', locale)}/tags/${tag}`
    await page.goto(talksTagRoute)
    return new A11yUserJourney(page)
  })
}

export function userInTalkDetail(page: Page, locale: UILanguages, postSlug = '2023-09-27-devcontainers') {
  return step(`a user in talk detail ${locale} ${postSlug}`, async () => {
    await mockThirdParty(page)
    const talksRoute = getURLForSection('talk', locale)
    const talksPostRoute = `${talksRoute}/${postSlug}`
    await page.goto(talksPostRoute)
    return new A11yUserJourney(page)
  })
}

export function userInTags(page: Page, locale: UILanguages) {
  return step(`a user in tags ${locale}`, async () => {
    await page.goto(`/${locale}/tags`)
    return new A11yUserJourney(page)
  })
}

export function userInHome(page: Page, locale: UILanguages) {
  return step(`a user in home ${locale}`, async () => {
    await page.goto(`/${locale}/`)
    await mockThirdParty(page)
    return new A11yUserJourney(page)
  })
}
