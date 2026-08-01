import type { Locator } from '@playwright/test'
import { verifyStep, type Verification } from '@tests/fixtures'

export class HighlightCard {
  constructor(
    readonly titleLocator: Locator,
    readonly excerptLocator: Locator,
    readonly ctaLocator: Locator,
  ) {}

  shouldBeVisible() {
    return verifyStep('highlight card has valid structure', async ({ expect }) => {
      await expect(this.titleLocator).toBeVisible()
      await expect(this.excerptLocator).toBeVisible()
      await expect(this.ctaLocator).toBeVisible()
    })
  }
}

export function highlightCard(parent: Locator): HighlightCard {
  return new HighlightCard(
    parent.locator('.highlight-title'),
    parent.locator('.highlight-excerpt'),
    parent.locator('.highlight-cta'),
  )
}

export function shouldHaveValidHighlightCards(cardLocator: Locator): Verification<void> {
  return verifyStep('validando cards', async ({ expect }) => {
    const cardLocators = await cardLocator.all()
    for (const card of cardLocators) {
      await highlightCard(card).shouldBeVisible().with(expect)
    }
  })
}
