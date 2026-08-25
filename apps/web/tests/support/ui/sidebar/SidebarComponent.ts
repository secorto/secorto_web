import { verifyStep } from '@tests/step'
import { sidebarToggleFromPage, SidebarToggle } from '@tests/support/ui/sidebar/SidebarToggle'
import { target } from '@tests/support/ui/components/Target'
import type { Target as TargetComponent } from '@tests/support/ui/components/Target'
import type { Page } from '@playwright/test'
import type { Loadable, LocalizedPage } from '@tests/support/ui/shared/contracts/localization'
import { ui, type UILanguages } from '@i18n/ui'

export class SidebarComponent implements Loadable, LocalizedPage<void> {
  constructor(
    readonly toggle: SidebarToggle,
    readonly sidebarTitle: TargetComponent,
    readonly aboutLink: TargetComponent,
    readonly logo: TargetComponent,
  ) {}

  shouldHaveHamburgerButton() {
    return this.toggle.shouldHaveHamburgerButton()
  }

  toggleSidebar() {
    return this.toggle.toggle()
  }

  shouldBeLoaded() {
    return verifyStep('sidebar is loaded', async ({ expect }) => {
      await this.sidebarTitle.shouldBeVisible().with(expect)
      await this.logo.shouldHaveCount(1).with(expect)
    })
  }

  shouldBeLocalized(locale: UILanguages) {
    return verifyStep('sidebar is localized correctly', async ({ expect }) => {
      await this.aboutLink.shouldHaveVisibleText(ui[locale]['nav.about']).with(expect)
    })
  }
}

export function sidebarPage(page: Page) {
  return new SidebarComponent(
    sidebarToggleFromPage(page),
    target('sidebar title', page.getByTestId('sidebar-title')),
    target('sidebar about link', page.getByTestId('sidebar-about')),
    target('sidebar logo', page.locator('nav.sidebar svg.sidebar-logo')),
  )
}
