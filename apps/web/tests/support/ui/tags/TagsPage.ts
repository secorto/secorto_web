import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { tagsPath, visit } from '@tests/support/ui/shared/NavigationPaths'
import { verifyStep } from '@tests/step'
import { defaultMainLayout, mainLayout, type MainLayoutComponent } from '@tests/support/ui/shared/components/MainLayout'
import { target } from '@tests/support/ui/components/Target'
import { urlValidator } from '@tests/support/ui/shared/flows/urlValidator'
import { a11yFlow, type A11y } from '@tests/support/ui/shared/flows/a11y'
import type { AuditablePage, Loadable, LocalizedPage, LocalizedUrl } from '@tests/support/ui/shared/contracts/localization'

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
export class TagsPage implements Loadable, LocalizedPage<void>, LocalizedUrl, AuditablePage {
  constructor(
    readonly mainLayout: MainLayoutComponent,
    readonly validateUrl: ReturnType<typeof urlValidator>,
    readonly a11y: A11y,
  ) {}

  shouldBeLoaded() {
    return this.mainLayout.shouldBeLoaded()
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

  auditA11y() {
    return this.a11y.audit()
  }
}

/**
 * Factory: creates a TagsPage instance for the given page.
 */
export function tagsPage(page: Page): TagsPage {
  return new TagsPage(
    mainLayout({
      ...defaultMainLayout(page),
      name: 'tags',
      headerTitle: target('tags header title', page.getByRole('heading', { level: 1 })),
      main: new TagsPageMain(page),
    }),
    urlValidator(page),
    a11yFlow(page),
  )
}

/**
 * Navigates to the global tags page and returns the page object.
 * Follows the same pattern as userInHome and userIsOnContentDetail.
 */
export function userInTags(page: Page, locale: UILanguages) {
  return visit(`a user in tags ${locale}`, page, tagsPath(locale), tagsPage)
}
