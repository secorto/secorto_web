import type { UILanguages } from '@i18n/ui'
import type { Loadable, LocalizedPage } from '@tests/support/ui/shared/contracts/localization'
import { step, verifyStep } from '@tests/step'
import { footerPage, type FooterComponent } from '@tests/support/ui/home/component/FooterComponent'
import { sidebarPage, type SidebarComponent } from '@tests/support/ui/sidebar/SidebarComponent'
import { target, type Target } from '@tests/support/ui/components/Target'
import { specializedTargetSelector, type TargetSelector } from '@tests/support/ui/components/TargetSelector'
import { themeToggle, type ThemeToggle } from './ThemeToggle'
import type { Page } from '@playwright/test'
import { link, type Link } from '@tests/support/ui/components/Link'


export class MainLayoutComponent<T = void> implements Loadable {
  constructor(
    readonly name: string,
    readonly root: Target,
    readonly headerTitle: Target,
    readonly sidebar: SidebarComponent,
    readonly footer: FooterComponent,
    readonly main: LocalizedPage<T>,
    readonly langLinks: TargetSelector<UILanguages, Link>,
    readonly themeToggle: ThemeToggle,
  ) { }

  shouldBeLoaded() {
    return verifyStep(`${this.name} layout is loaded`, async ({ expect }) => {
      await this.root.shouldBeVisible(expect)
      await this.headerTitle.shouldBeVisible(expect)
      await this.headerTitle.shouldHaveText(expect, /\S+/)
      await this.footer.shouldBeLoaded().with(expect)
      await this.sidebar.shouldBeLoaded().with(expect)
      await this.themeToggle.shouldBeVisible(expect)
    })
  }

  shouldBeLocalized(locale: UILanguages) {
    return verifyStep(`${this.name} layout is localized in ${locale}`, async ({ expect }) => {
      await this.root.shouldHaveAttribute(expect, 'lang', locale)
      await this.footer.shouldBeLocalized(locale).with(expect)
      await this.sidebar.shouldBeLocalized(locale).with(expect)
      return this.main.shouldBeLocalized(locale).with(expect)
    })
  }

  shouldHaveTheme(theme: string) {
    return verifyStep(`${this.name} layout should have theme ${theme}`, async ({ expect }) => {
      const re = new RegExp(`\\b${String(theme)}\\b`)
      await this.root.shouldHaveClass(expect, re)
    })
  }

  toggleTheme() {
    return step('toggle theme', async () => {
      await this.themeToggle.click()
    })
  }

  getTransformOfThemeToggle() {
    return this.themeToggle.getTransform()
  }

  themeToggleShouldBeDifferent(initialTransform: string) {
    return this.themeToggle.shouldBeDifferent(initialTransform)
  }

  switchTo(locale: UILanguages) {
    return step(`switch language to ${locale}`, async () => {
      const tagLink = this.langLinks.get(locale)
      await tagLink.click()
    })
  }
}

export function mainLayout<T>({
  name,
  root,
  headerTitle,
  sidebar,
  footer,
  main,
  langLinks,
  themeToggle,
}: {
  name: string,
  root: Target,
  headerTitle: Target,
  sidebar: SidebarComponent,
  main: LocalizedPage<T>,
  footer: FooterComponent,
  langLinks: TargetSelector<UILanguages, Link>,
  themeToggle: ThemeToggle,
}) {
  return new MainLayoutComponent(name, root, headerTitle, sidebar, footer, main, langLinks, themeToggle)
}

export function defaultMainLayout(page: Page) {
  return {
    root: target('html root', page.locator('html')),
    sidebar: sidebarPage(page),
    footer: footerPage(page),
    langLinks: specializedTargetSelector(link, 'language link', (lang: UILanguages) =>
      page.getByTestId(`lang-${lang}`)
    ),
    themeToggle: themeToggle('theme toggle', page.getByTestId('theme-toggle')),
  }
}
