import type { Locator } from '@playwright/test'
import { verifyStep } from '@tests/step'
import { Target, target } from './Target'
import { TargetSelector, targetSelector } from './TargetSelector'

export class HighlightCards {
  constructor(
    readonly parent: Target,
    readonly title: TargetSelector<Locator>,
    readonly excerpt: TargetSelector<Locator>,
    readonly cta: TargetSelector<Locator>,
  ) {}

  shouldBeValid() {
    return verifyStep('highlight cards are valid', async ({ expect }) => {
      await this.parent.shouldHaveAtLeastOne().with(expect)
      const cardCount = await this.parent.locator.count()
      for (let i = 0; i < cardCount; i++) {
        const card = this.parent.locator.nth(i)
        await this.shouldHaveValidCard(card).with(expect)
      }
    })
  }

  shouldHaveValidCard(parent: Locator) {
    return verifyStep('highlight card is valid', async ({ expect }) => {
      await this.title.get(parent).shouldBeVisible(expect)
      await this.excerpt.get(parent).shouldBeVisible(expect)
      await this.cta.get(parent).shouldBeVisible(expect)
    })
  }
}

export function highlightCards(containerLocator: Locator) {
  return new HighlightCards(
    target('container for highlight', containerLocator),
    targetSelector('highlight card title', (card: Locator) => card.locator('.highlight-title')),
    targetSelector('highlight card excerpt', (card: Locator) => card.locator('.highlight-excerpt')),
    targetSelector('highlight card cta', (card: Locator) => card.locator('.highlight-cta')),
  )
}
