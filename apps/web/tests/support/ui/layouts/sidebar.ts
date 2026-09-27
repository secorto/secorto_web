import { step, verifyStep } from '@tests/step'
import { target, type TargetComponent } from '../target/target'
import type { Page } from '@playwright/test'
import type { Loadable, LocalizedPage } from '@tests/support/ui/shared/contracts/localization'
import { ui, type UILanguages } from '@i18n/ui'
import { logo, type Logo } from '../target/logo'

export class SidebarComponent implements Loadable, LocalizedPage<void> {
  constructor(
    readonly hamburger: TargetComponent,
    readonly sidebarToggle: TargetComponent,
    readonly sidebarTitle: TargetComponent,
    readonly aboutLink: TargetComponent,
    readonly logo: Logo,
  ) {}

  toggleSidebar() {
    return step('toggle sidebar', async () => {
      await this.hamburger.click()
    })
  }

  shouldBeLoaded() {
    return verifyStep('sidebar is loaded', async ({ expect }) => {
      await this.sidebarTitle.shouldBeVisible(expect)
      await this.logo.shouldHaveCount(expect, 1)
      await this.aboutLink.shouldBeVisible(expect)
    })
  }

  shouldBeLocalized(locale: UILanguages) {
    return verifyStep('sidebar is localized correctly', async ({ expect }) => {
      await this.aboutLink.shouldHaveText(expect, ui[locale]['nav.about'])
    })
  }


  shouldBeOpen() {
    return verifyStep('sidebar should be open', async ({ expect }) => {
      await this.hamburger.shouldBeVisible(expect)
      await this.sidebarToggle.shouldHaveClass(expect, /sidebar-open/)
      await this.hamburger.shouldHaveClass(expect, /sidebar-open/)
    })
  }

  shouldBeClosed() {
    return verifyStep('sidebar should be closed', async ({ expect }) => {
      await this.hamburger.shouldBeVisible(expect)
      await this.sidebarToggle.shouldNotHaveClass(expect, /sidebar-open/)
      await this.hamburger.shouldNotHaveClass(expect, /sidebar-open/)
    })
  }

  shouldBePermanentlyOpen() {
    return verifyStep('sidebar should be permanently open', async ({ expect }) => {
      await this.sidebarToggle.shouldBeVisible(expect)
      await this.hamburger.shouldNotBeVisible(expect)
      await this.hamburger.shouldNotHaveClass(expect, /sidebar-open/)
    })
  }
}

export function sidebarPage(page: Page) {
  return new SidebarComponent(
    target('hamburger', page.getByTestId('hamburger')),
    target('sidebar toggle', page.locator('.sidebar-toggle')),
    target('sidebar title', page.getByTestId('sidebar-title')),
    target('sidebar about link', page.getByTestId('sidebar-about')),
    logo('sidebar photo', page.getByTestId('sidebar-photo')),
  )
}
