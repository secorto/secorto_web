import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { step } from '@tests/fixtures'
import { target, targetSelector } from '@tests/support/ui/components/Target'
import type { Target as TargetComponent } from '@tests/support/ui/components/Target'
import type { TargetSelector } from '@tests/support/ui/components/Target'
import { comments } from '@tests/support/ui/content/Comments'
import type { Comments as CommentsComponent } from '@tests/support/ui/content/Comments'

export class ContentListPage {
  constructor(
    readonly name: string,
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
    return step(`filter ${this.name} list by tag "${tag}"`, async ({ expect }) => {
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

  shouldHaveTags(ariaSnapshot: string) {
    return step(`${this.name} detail has expected tags`, async ({ expect }) => {
      await expect(this.tags.locator).toMatchAriaSnapshot(ariaSnapshot)
    })
  }

  shouldRenderTagsForSection() {
    return step(`${this.name} list renders available tags`, async ({ expect }) => {
      await expect(this.tags.locator).toBeVisible()

      const tagLinks = this.tags.locator.locator('[data-testid^="tag-link-"]')
      await expect
        .poll(async () => tagLinks.count())
        .toBeGreaterThan(0)
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

export function contentListPage(page: Page, name: string) {
  return new ContentListPage(
    name,
    targetSelector(`${name} tag link`, (tag: string) => page.getByTestId(`tag-link-${tag}`)),
    targetSelector(`${name} item link`, (href: string) => page.locator(`[href="${href}"]`)),
    target(`${name} header title`, page.getByTestId('header-title')),
    target(`${name} tags`, page.getByTestId('tags')),
    comments(
      page.locator('.comments script[src*="giscus.app"]'),
      page.locator('iframe.giscus-frame'),
    ),
    target(`${name} role`, page.getByTestId('post-role')),
    target(`${name} responsibilities`, page.getByTestId('post-responsibilities')),
    target(`${name} website`, page.getByTestId('post-website')),
  )
}
