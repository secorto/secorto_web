import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { visit } from '@tests/pages/shared/UserJourneyFactory'
import { tagsPath } from '@tests/pages/shared/NavigationPaths'
import { pageHelper } from '@tests/pages/components/PageHelper'
import { TagsPage, tagsPage } from '@tests/pages/content/TagsPage'

export class TagsUserJourney {
  constructor(
    readonly page: Page,
    readonly tags: TagsPage,
  ) {}

  shouldHavePageTitle(expected: string) {
    return this.tags.shouldHavePageTitle(expected)
  }

  shouldHavePageDescription(expected: string) {
    return this.tags.shouldHavePageDescription(expected)
  }

  shouldShowTagGroups() {
    return this.tags.shouldShowTagGroups()
  }

  shouldHaveAtLeastOneTagGroup() {
    return this.tags.shouldHaveAtLeastOneTagGroup()
  }

  firstTagGroupHeadingShouldBeVisible() {
    return this.tags.firstTagGroupHeadingShouldBeVisible()
  }

  shouldHaveAtLeastOneLinkInFirstTagGroup() {
    return this.tags.shouldHaveAtLeastOneLinkInFirstTagGroup()
  }

  firstTagLinkHrefMatches(pattern: RegExp) {
    return this.tags.firstTagLinkHrefMatches(pattern)
  }

  clickFirstTagAndWaitForUrl(urlRegex: RegExp) {
    return this.tags.clickFirstTagAndWaitForUrl(urlRegex)
  }

  shouldHaveUrlContaining(locale: string) {
    return pageHelper(this.page).shouldHaveURL(new RegExp(`/${locale}/.+/tags/`))
  }

  shouldContainAvailabilityText(expectedText: string) {
    return this.tags.shouldContainAvailabilityText(expectedText)
  }
}

export function tagsUserJourney(page: Page) {
  return new TagsUserJourney(page, tagsPage(page))
}

export const userIsOnTags = (page: Page, locale: UILanguages) =>
  visit(
    `a user in tags ${locale}`,
    page,
    tagsPath(locale),
    (p) => tagsUserJourney(p),
  )
