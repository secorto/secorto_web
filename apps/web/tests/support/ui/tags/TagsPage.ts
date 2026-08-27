import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { NavigablePage, visit, createPageContext } from '@tests/support/ui/shared/pages'
import { verifyStep } from '@tests/step'
import type { MainLayoutComponent } from '@tests/support/ui/shared/components/MainLayout'
import type { Verification } from '@tests/step'
import type { LocalizedPage, LocalizedUrl } from '@tests/support/ui/shared/contracts/localization'
import type { A11y } from '@tests/support/ui/shared/flows/a11y'

/**
 * Main component for the global tags page (/locale/tags).
 * Validates that the tag groups list is rendered.
 */
export class TagsPageMain implements LocalizedPage<void> {
  constructor(private page: Page) {}

  shouldBeLocalized(_locale: UILanguages) {
    return verifyStep('global tags page renders tag groups', async ({ expect }) => {
      const tagGroups = this.page.getByTestId('global-tag-groups')
      await expect(tagGroups).toBeVisible()
    })
  }
}

/**
 * Orchestrator for the global tags page.
 * Composes MainLayout + a11yFlow, following the same pattern as HomePage and ContentDetailPage.
 */
export class TagsPage extends NavigablePage implements LocalizedPage<void>, LocalizedUrl {
  constructor(
    mainLayout: MainLayoutComponent,
    readonly validateUrl: (expected: string | RegExp) => Verification<void>,
    a11y: A11y,
  ) {
    super(mainLayout, a11y)
  }

  shouldBeLocalized(locale: UILanguages) {
    return verifyStep(`tags page is localized in ${locale}`, async ({ expect }) => {
      await this.shouldBeInLocale(locale).with(expect)
      await this.mainLayout.shouldBeLocalized(locale).with(expect)
    })
  }

  shouldBeInLocale(locale: UILanguages) {
    const expected = new RegExp(`/${locale}/tags(/|$)`)
    return this.validateUrl(expected)
  }
}

/**
 * Factory: creates a TagsPage instance for the given page.
 */
export function tagsPage(page: Page): TagsPage {
  const { layout, validateUrl, a11y } = createPageContext(page, 'tags', new TagsPageMain(page))
  return new TagsPage(layout, validateUrl, a11y)
}

/**
 * Navigates to the global tags page and returns the page object.
 * Follows the same pattern as userInHome and userIsOnContentDetail.
 */
export function userInTags(page: Page, locale: UILanguages) {
  return visit(`a user in tags ${locale}`, page, `/${locale}/tags`, tagsPage)
}
