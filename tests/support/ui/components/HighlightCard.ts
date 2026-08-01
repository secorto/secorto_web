import type { Locator } from '@playwright/test'
import { verifyStep } from '@tests/fixtures'
import { Target, target, targetSelector, TargetSelector } from './Target'

export class HighlightCards {
  constructor(
    readonly parent: Target,
    readonly title: TargetSelector<Locator>,
    readonly excerpt: TargetSelector<Locator>,
    readonly cta: TargetSelector<Locator>,
  ) {}

  shouldBeValid() {
    return verifyStep('highlight cards are valid', async ({ expect }) => {
      const cardLocators = await this.parent.locator.all()
      for (const card of cardLocators) {
        await this.shouldHaveValidCard(card).with(expect)
      }
    })
  }

  shouldHaveValidCard(parent: Locator) {
    return verifyStep('highlight card is valid', async ({ expect }) => {
      await this.title.get(parent).shouldBeVisible().with(expect)
      await this.excerpt.get(parent).shouldBeVisible().with(expect)
      await this.cta.get(parent).shouldBeVisible().with(expect)
    })
  }
}

export function highlightCards(containerLocator: Locator) {
  return new HighlightCards(
    target('container for hightlight', containerLocator),
    targetSelector('highlight card title', (containerLocator) => containerLocator.locator('.highlight-title')),
    targetSelector('highlight card excerpt', (containerLocator) => containerLocator.locator('.highlight-excerpt')),
    targetSelector('highlight card cta', (containerLocator) => containerLocator.locator('.highlight-cta')),
  )
}
