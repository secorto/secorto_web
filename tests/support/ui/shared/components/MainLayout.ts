import type { UILanguages } from "@i18n/ui"
import type { LocalizedPage } from "@tests/support/ui/shared/contracts/localization"
import { step, verifyStep } from "@tests/fixtures"
import { footerPage, type FooterComponent } from "@tests/support/ui/home/component/FooterComponent"
import { sidebarPage, type SidebarComponent } from "@tests/support/ui/sidebar/SidebarComponent"
import { target, targetSelector, type Target, type TargetSelector } from "@tests/support/ui/components/Target"
import { themeToggleFromPage, type ThemeToggle } from "./ThemeToggle"
import type { Page } from "@playwright/test"


export class MainLayoutComponent<T = void> implements LocalizedPage<T> {
  constructor(
    readonly root: Target,
    readonly headerTitle: Target,
    readonly sidebar: SidebarComponent,
    readonly footer: FooterComponent,
    readonly main: LocalizedPage<T>,
    readonly langLinks: TargetSelector<UILanguages>,
    readonly themeToggle: ThemeToggle,
  ) {}

  shouldBeLoaded(locale: UILanguages) {
    return verifyStep('main layout is loaded', async ({ expect }) => {
      await this.root.shouldBeVisible().with(expect)
      await this.root.shouldHaveAttribute('lang', locale).with(expect)
      await this.headerTitle.shouldHaveVisibleText(/\S+/).with(expect)
      await this.footer.shouldBeLoaded(locale).with(expect)
      await this.sidebar.shouldBeLoaded(locale).with(expect)
      await this.themeToggle.shouldBeVisible().with(expect)
      return this.main.shouldBeLoaded(locale).with(expect)
    })
  }

  shouldHaveTheme(theme: string) {
    const re = new RegExp(`\\b${String(theme)}\\b`)
    return this.root.shouldHaveClass(re)
  }

  toggleTheme() {
    return this.themeToggle.toggleTheme()
  }

  getTransformOfThemeToggle() {
    return this.themeToggle.getTransform()
  }

  themeToggleShouldBeDifferent(initialTransform: string) {
    return this.themeToggle.shouldBeDifferent(initialTransform)
  }


  shouldHaveLanguageOption(locale: UILanguages) {
    return this.langLinks.get(locale).shouldBeVisible()
  }

  switchTo(locale: UILanguages) {
    return step(`switch language to ${locale}`, async () => {
      await this.langLinks.get(locale).locator.click()
    })
  }
}

export function mainLayout({
  root,
  headerTitle,
  sidebar,
  footer,
  main,
  langLinks,
  themeToggle,
}: {
  root: Target,
  headerTitle: Target,
  sidebar: SidebarComponent,
  main: LocalizedPage,
  footer: FooterComponent,
  langLinks: TargetSelector<UILanguages>,
  themeToggle: ThemeToggle
}) {
  return new MainLayoutComponent(root, headerTitle, sidebar, footer, main, langLinks, themeToggle)
}

export function defaultMainLayout(page: Page) {
  return {
    root: target('html root', page.locator('html')),
    sidebar: sidebarPage(page),
    footer: footerPage(page),
    langLinks: targetSelector('language link', (lang: UILanguages) =>
      page.getByTestId(`lang-${lang}`)
    ),
    themeToggle: themeToggleFromPage(page),
  }
}
