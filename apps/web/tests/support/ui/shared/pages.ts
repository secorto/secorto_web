import type { Page } from '@playwright/test'
import type { Verification } from '@tests/step'
import { orchestrateStep, type Step } from '@tests/step'
import { mockThirdParty } from '@tests/support/mocks/mockThirdParty'
import type { Loadable, LocalizedPage, LocalizedUrl } from '@tests/support/ui/shared/contracts/localization'
import type { UILanguages } from '@i18n/ui'
import type { MainLayoutComponent } from '@tests/support/ui/layouts/main'
import { mainLayout, defaultMainLayout } from '@tests/support/ui/layouts/main'
import { target } from '@tests/support/ui/target/target'
import { urlValidator } from '@tests/support/ui/shared/flows/urlValidator'
import { a11yFlow, type A11y } from '@tests/support/ui/shared/flows/a11y'

/**
 * Unified page context: layout, URL validation, and accessibility audit.
 */
export type PageContext = {
  readonly layout: MainLayoutComponent
  readonly validateUrl: (expected: string | RegExp) => Verification<void>
  readonly a11y: A11y
}

/**
 * Base for all navigable pages.
 */
export abstract class NavigablePage implements Loadable {
  constructor(
    readonly mainLayout: MainLayoutComponent,
    readonly a11y: A11y,
  ) {}

  shouldBeLoaded() {
    return this.mainLayout.shouldBeLoaded()
  }

  auditA11y() {
    return this.a11y
  }
}

/**
 * Base for localized pages. Subclasses implement expectedUrl(locale).
 */
export abstract class LocalizedNavigablePage
  extends NavigablePage
  implements LocalizedUrl, LocalizedPage<void> {
  protected readonly validateUrl: (expected: string | RegExp) => Verification<void>

  constructor(context: PageContext) {
    super(context.layout, context.a11y)
    this.validateUrl = context.validateUrl
  }

  /**
   * URL pattern for this page (must be implemented by subclass).
   */
  protected abstract expectedUrl(locale: UILanguages): string | RegExp

  /**
   * Validates URL matches expectedUrl() pattern.
   */
  shouldBeInLocale(locale: UILanguages): Verification<void> {
    return this.validateUrl(this.expectedUrl(locale))
  }

  /**
   * Validates content is localized for the given locale.
   */
  shouldBeLocalized(locale: UILanguages) {
    return this.mainLayout.shouldBeLocalized(locale)
  }
}

/**
 * Navigates to URL, creates page object, and validates it loaded.
 */
export const visit = <T extends Loadable>(
  title: string,
  page: Page,
  url: string,
  factory: (page: Page) => T | Promise<T> | Step<T>,
  preAct?: (page: Page) => Step<void> | void,
  gotoOptions?: Parameters<Page['goto']>[1],
) => orchestrateStep(
    title,
    async () => {
      if (preAct) await preAct(page)
      await mockThirdParty(page)
      await page.goto(url, gotoOptions)
      return await factory(page)
    }, async (pageObject, { expect }) => {
      await pageObject.shouldBeLoaded().with(expect)
      return pageObject
    }
  )

/**
 * Creates PageContext: layout, URL validation, and a11y auditing.
 */
export function createPageContext(
  page: Page,
  pageName: string,
  main: LocalizedPage<void>,
): PageContext {
  return {
    layout: mainLayout({
      ...defaultMainLayout(page),
      name: pageName,
      headerTitle: target(`${pageName} header title`, page.getByRole('heading', { level: 1 })),
      main,
    }),
    validateUrl: urlValidator(page),
    a11y: a11yFlow(page),
  }
}
