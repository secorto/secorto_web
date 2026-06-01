import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { AxeBuilder } from '@axe-core/playwright'
import { getURLForSection } from '@utils/sections'
import { visit } from '@tests/pages/UserJourneyFactory'
import { step } from '@tests/fixtures'

const DEFAULT_EXCLUDES = [
  '[data-netlify-deploy-id]', 'iframe', 'iframe *'
]

export class A11yUserJourney {
  constructor(readonly page: Page) {}

  auditA11y(excludes?: string[]) {
    return step('audit a11y', async () => {
      const builder = new AxeBuilder({ page: this.page })
      const exs = excludes ?? DEFAULT_EXCLUDES
      for (const ex of exs) builder.exclude(ex)
      await this.page.waitForLoadState('load')
      return await builder.analyze()
    })
  }

  shouldPassAudit(results: { violations?: unknown[] }) {
    return step('should pass accessibility audit', async ({ expect }) => {
      await expect(results.violations ?? []).toEqual([])
    })
  }
}

export function a11yUserJourney(page: Page) {
  return new A11yUserJourney(page)
}

export function userInTalk(page: Page, locale: UILanguages) {
  return visit(`a user in talk list ${locale}`, page, getURLForSection('talk', locale), a11yUserJourney)
}

export function userInTalkTag(page: Page, locale: UILanguages, tag = 'containers') {
  const talksTagRoute = `${getURLForSection('talk', locale)}/tags/${tag}`
  return visit(`a user in talk tag ${locale} ${tag}`, page, talksTagRoute, a11yUserJourney)
}

export function userInTalkDetail(page: Page, locale: UILanguages, postSlug: string) {
  const talksPostRoute = `${getURLForSection('talk', locale)}/${postSlug}`
  return visit(`a user in talk detail ${locale} ${postSlug}`, page, talksPostRoute, a11yUserJourney)
}

export function userInTags(page: Page, locale: UILanguages) {
  return visit(`a user in tags ${locale}`, page, `/${locale}/tags`, a11yUserJourney)
}

export function userInHome(page: Page, locale: UILanguages) {
  return visit(`a user in home ${locale}`, page, `/${locale}/`, a11yUserJourney)
}
