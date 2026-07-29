import type { UILanguages } from "@i18n/ui"
import type { LocalizedPage } from "@tests/support/ui/shared/contracts/localization"
import { step, verifyStep } from "@tests/fixtures"
import type { FooterComponent } from "@tests/support/ui/home/component/FooterComponent"
import type { SidebarPage } from "@tests/support/ui/sidebar/SidebarPage"
import type { Target, TargetSelector } from "@tests/support/ui/components/Target"

export class MainLayoutComponent<T = void> implements LocalizedPage<T> {
  constructor(
    readonly root: Target,
    readonly headerTitle: Target,
    readonly sidebar: SidebarPage,
    readonly footer: FooterComponent,
    readonly main: LocalizedPage<T>,
    readonly langLinks: TargetSelector<UILanguages>,

  ) {}

  shouldBeLoaded(locale: UILanguages) {
    return verifyStep('main layout is loaded', async ({ expect }) => {
      await this.root.shouldBeVisible().with(expect)
      await this.headerTitle.shouldHaveVisibleText(/\S+/).with(expect)
      await this.footer.shouldBeLoaded(locale).with(expect)
      await this.sidebar.shouldBeLoaded(locale).with(expect)
      return this.main.shouldBeLoaded(locale).with(expect)
    })
  }

  shouldHaveTheme(theme: string) {
    const re = new RegExp(`\\b${String(theme)}\\b`)
    return this.root.shouldHaveClass(re)
  }

  toggleTheme() {
    return this.sidebar.toggleTheme()
  }

  getTransformOfThemeToggle() {
    return this.sidebar.getTransformOfThemeToggle()
  }

  themeToggleShouldBeDifferent(initialTransform: string) {
    return this.sidebar.themeToggleShouldBeDifferent(initialTransform)
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
  langLinks
}: {
  root: Target,
  headerTitle: Target,
  sidebar: SidebarPage,
  main: LocalizedPage,
  footer: FooterComponent,
  langLinks: TargetSelector<UILanguages>
}) {
  return new MainLayoutComponent(root, headerTitle, sidebar, footer, main, langLinks)
}
