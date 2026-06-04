import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { AxeBuilder } from '@axe-core/playwright'
import { visit, userInHomeFactory } from '@tests/pages/shared/UserJourneyFactory'
import type { SectionType } from '@domain/section'
import { step } from '@tests/fixtures'
import { contentDetailsPath, contentListPath, contentTagsPath, tagsPath } from '@tests/pages/shared/NavigationPaths'

const DEFAULT_EXCLUDES = [
  '[data-netlify-deploy-id]', 'iframe', 'iframe *'
]

export class A11yPage {
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
      expect(results.violations ?? []).toEqual([])
    })
  }
}

export function a11yPage(page: Page) {
  return new A11yPage(page)
}

export function userInTalk(page: Page, locale: UILanguages) {
  return visit(`a user in talk list ${locale}`, page, contentListPath('talk', locale), a11yPage)
}

export function userInTalkTag(page: Page, locale: UILanguages, tag = 'containers') {
  const talksTagRoute = contentTagsPath('talk', locale, tag)
  return visit(`a user in talk tag ${locale} ${tag}`, page, talksTagRoute, a11yPage)
}

export function userInTalkDetail(page: Page, locale: UILanguages, postSlug: string) {
  const talksPostRoute = contentDetailsPath('talk', locale, postSlug)
  return visit(`a user in talk detail ${locale} ${postSlug}`, page, talksPostRoute, a11yPage)
}

export function userInTags(page: Page, locale: UILanguages) {
  return visit(`a user in tags ${locale}`, page, tagsPath(locale), a11yPage)
}

export function userInHome(page: Page, locale: UILanguages) {
  return userInHomeFactory(`a user in home ${locale}`, page, locale, a11yPage)
}

export function userInContentList(page: Page, locale: UILanguages, collection: SectionType) {
  return visit(`a user in ${collection} list ${locale}`, page, contentListPath(collection, locale), a11yPage)
}

export function userInContentTag(page: Page, locale: UILanguages, collection: SectionType, tag = 'containers') {
  return visit(`a user in ${collection} tag ${locale} ${tag}`, page, contentTagsPath(collection, locale, tag), a11yPage)
}

export function userInContentDetail(page: Page, locale: UILanguages, collection: SectionType, postSlug: string) {
  return visit(
    `a user in ${collection} detail ${locale} ${postSlug}`,
    page,
    contentDetailsPath(collection, locale, postSlug),
    a11yPage,
  )
}
