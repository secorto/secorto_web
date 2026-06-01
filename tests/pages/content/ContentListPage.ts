import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { step } from '@tests/fixtures'
import { target, targetSelector } from '@tests/pages/components/Target'
import type { Target as TargetComponent } from '@tests/pages/components/Target'
import type { TargetSelector } from '@tests/pages/components/Target'
import { comments } from '@tests/pages/content/Comments'
import type { Comments as CommentsComponent } from '@tests/pages/content/Comments'

export class ContentListPage {
  constructor(
    readonly tagLinks: TargetSelector<string>,
    readonly itemLinks: TargetSelector<string>,
    readonly headerTitle: TargetComponent,
    readonly tags: TargetComponent,
    readonly comments: CommentsComponent,
    readonly postRole: TargetComponent,
    readonly postResponsibilities: TargetComponent,
    readonly postWebsite: TargetComponent,
  ) {}

  shouldHaveListHeaderTitle(expected: string) {
    return this.headerTitle.shouldHaveText(expected)
  }

  shouldHaveDetailTitle(expected: string) {
    return this.headerTitle.shouldHaveText(expected)
  }

  shouldHaveFilteredTitle(expectedSectionTitle: string, tag: string) {
    return this.headerTitle.shouldHaveText(`${expectedSectionTitle} - ${tag}`)
  }

  filterByTag(tag: string) {
    return step(`filter talks by tag "${tag}"`, async ({ expect }) => {
      const tagLink = this.tagLinks.get(tag)
      await expect(tagLink.locator).not.toHaveClass(/active/)
      await tagLink.locator.click()
      await expect(tagLink.locator).toHaveClass(/active/)
    })
  }

  clickItem(href: string, title: string) {
    return step(title, async () => {
      await this.itemLinks.get(href).locator.click()
    })
  }

  clickItemAndReturn<T>(href: string, title: string, next: () => T) {
    return step(title, async () => {
      await this.itemLinks.get(href).locator.click()
      return next()
    })
  }

  shouldHaveTags(ariaSnapshot: string) {
    return step('detail has expected tags', async ({ expect }) => {
      await expect(this.tags.locator).toMatchAriaSnapshot(ariaSnapshot)
    })
  }

  shouldHaveComments(locale: UILanguages) {
    return this.comments.shouldBeReady(locale)
  }

  shouldHaveRole(expected: string) {
    return this.postRole.shouldHaveText(expected)
  }

  shouldHaveResponsibilities(expected: string) {
    return this.postResponsibilities.shouldHaveText(expected)
  }

  shouldHaveWebsite(expected: string) {
    return this.postWebsite.shouldHaveAttribute('href', expected)
  }
}

export function contentListPage(page: Page) {
  return new ContentListPage(
    targetSelector((tag: string) => page.getByTestId(`tag-link-${tag}`)),
    targetSelector((href: string) => page.locator(`[href="${href}"]`)),
    target(page.getByTestId('header-title')),
    target(page.getByTestId('tags')),
    comments(
      page.locator('.comments script[src*="giscus.app"]'),
      page.locator('iframe.giscus-frame'),
    ),
    target(page.getByTestId('post-role')),
    target(page.getByTestId('post-responsibilities')),
    target(page.getByTestId('post-website')),
  )
}
