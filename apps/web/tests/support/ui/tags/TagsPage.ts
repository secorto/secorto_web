import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { buildUrlPattern } from '@tests/support/ui/shared/flows/urlValidation'
import { LocalizedNavigablePage, visit, createPageContext, type PageContext } from '@tests/support/ui/shared/pages'
import { verifyStep } from '@tests/step'
import type { LocalizedPage } from '@tests/support/ui/shared/contracts/localization'

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
 */
export class TagsPage extends LocalizedNavigablePage {
  constructor(context: PageContext) {
    super(context)
  }

  protected expectedUrl(locale: UILanguages): string | RegExp {
    return buildUrlPattern(`/${locale}/tags`)
  }
}

/**
 * Creates TagsPage instance.
 */
export function tagsPage(page: Page): TagsPage {
  const context = createPageContext(page, 'tags', new TagsPageMain(page))
  return new TagsPage(context)
}

/**
 * Navigates to the tags page.
 */
export function userInTags(page: Page, locale: UILanguages) {
  return visit(`a user in tags ${locale}`, page, `/${locale}/tags`, tagsPage)
}
