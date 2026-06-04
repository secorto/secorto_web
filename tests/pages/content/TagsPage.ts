import type { Page } from '@playwright/test'
import { step } from '@tests/fixtures'
import { link } from '@tests/pages/components/Link'
import type { Link as LinkComponent } from '@tests/pages/components/Link'
import { target } from '@tests/pages/components/Target'
import type { Target as TargetComponent } from '@tests/pages/components/Target'

export class TagsPage {
  constructor(
    readonly page: Page,
    readonly pageTitle: TargetComponent,
    readonly pageDescription: TargetComponent,
    readonly tagGroups: TargetComponent,
    readonly allTagGroups: TargetComponent,
    readonly firstTagLink: LinkComponent,
    readonly pageBody: TargetComponent,
  ) {}

  shouldHavePageTitle(expected: string) {
    return this.pageTitle.shouldHaveText(expected)
  }

  shouldHavePageDescription(expected: string) {
    return this.pageDescription.shouldHaveText(expected)
  }

  shouldShowTagGroups() {
    return this.tagGroups.shouldBeVisible()
  }

  shouldHaveAtLeastOneTagGroup() {
    return step('tags page should render at least one tag group', async ({ expect }) => {
      await expect
        .poll(async () => this.allTagGroups.locator.count())
        .toBeGreaterThan(0)
    })
  }

  firstTagGroupHeadingShouldBeVisible() {
    return target('first tag group heading', this.allTagGroups.locator.first().locator('h2').first()).shouldBeVisible()
  }

  shouldHaveAtLeastOneLinkInFirstTagGroup() {
    return step('first tag group should contain links', async ({ expect }) => {
      const links = this.allTagGroups.locator.first().locator('a')
      await expect
        .poll(async () => links.count())
        .toBeGreaterThan(0)
    })
  }

  firstTagLinkHrefMatches(pattern: RegExp) {
    return this.firstTagLink.hrefMatchesPattern(pattern)
  }

  clickFirstTagAndWaitForUrl(urlRegex: RegExp) {
    return step('click first tag and wait navigation', async () => {
      await Promise.all([
        this.page.waitForURL(urlRegex),
        this.firstTagLink.click(),
      ])
    })
  }

  shouldContainAvailabilityText(expectedText: string) {
    return this.pageBody.shouldContainText(expectedText)
  }
}

export function tagsPage(page: Page) {
  return new TagsPage(
    page,
    target('tags header title', page.getByTestId('header-title')),
    target('tags description', page.getByTestId('tags-description')),
    target('tags groups container', page.getByTestId('global-tag-groups')),
    target('all tag groups', page.getByTestId(/^global-tag-/)),
    link('first tag link', page.getByTestId('global-tag-groups').locator('a').first()),
    target('tags page body', page.locator('body')),
  )
}
