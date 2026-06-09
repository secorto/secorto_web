import type { UILanguages } from '@i18n/ui'
import type { SectionType } from '@domain/section'
import { getURLForSection } from '@utils/sections'
import type { Page } from '@playwright/test'
import { step } from '@tests/fixtures'
import { mockThirdParty } from '@tests/e2e/helpers/mockThirdParty'

export function homePath(locale: UILanguages) {
  return `/${locale}/`
}

export function tagsPath(locale: UILanguages) {
  return `/${locale}/tags`
}

export function contentListPath(section: SectionType, locale: UILanguages) {
  return getURLForSection(section, locale)
}

export function contentDetailsPath(section: SectionType, locale: UILanguages, slug: string) {
  return `${contentListPath(section, locale)}/${slug}`
}

export function contentTagsPath(section: SectionType, locale: UILanguages, tag: string) {
  return `${contentListPath(section, locale)}/tags/${tag}`
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
      await page.goto(url)
      return factory(page)
    })
