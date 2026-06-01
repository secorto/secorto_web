import { target } from '@tests/pages/components/Target'
import type { Page } from '@playwright/test'
import type { Target as TargetComponent } from '@tests/pages/components/Target'
import { homeHighlights } from '@tests/pages/home/HomeHighlights'
import type { HomeHighlights as HomeHighlightsComponent } from '@tests/pages/home/HomeHighlights'

export class HomePage {
  constructor(
    readonly headerTitle: TargetComponent,
    readonly avatar: TargetComponent,
    readonly bioText: TargetComponent,
    readonly homeHighlights: HomeHighlightsComponent,
  ) {}

  shouldHaveTitle() {
    return this.headerTitle.shouldHaveVisibleText(/\S+/)
  }
}

export function homePage(page: Page) {
  return new HomePage(
    target(page.getByRole('heading', { level: 1 })),
    target(page.locator('.home-avatar svg')),
    target(page.locator('.home-bio-text')),
    homeHighlights(page.locator('.highlights')),
  )
}
