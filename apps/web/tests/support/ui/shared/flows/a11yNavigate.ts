import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import type { SectionType } from '@domain/section'
import { getEntryTagURL, getEntryURL, getURLForSection } from '@domain/section'
import { tagsPath, visit } from '@tests/support/ui/shared/NavigationPaths'
import { a11yFlow } from '@tests/support/ui/shared/flows/a11y'

export function userInTags(page: Page, locale: UILanguages) {
  return visit(`a user in tags ${locale}`, page, tagsPath(locale), a11yFlow)
}

export function userInContentList(page: Page, locale: UILanguages, collection: SectionType) {
  return visit(`a user in ${collection} list ${locale}`, page, getURLForSection(collection, locale), a11yFlow)
}

export function userInContentTag(page: Page, locale: UILanguages, collection: SectionType, tag = 'containers') {
  return visit(`a user in ${collection} tag ${locale} ${tag}`, page, getEntryTagURL(collection, locale, tag), a11yFlow)
}

export function userInContentDetail(page: Page, locale: UILanguages, collection: SectionType, postSlug: string) {
  return visit(
    `a user in ${collection} detail ${locale} ${postSlug}`,
    page,
    getEntryURL(collection, locale, postSlug),
    a11yFlow,
  )
}
