import type { Locator } from '@playwright/test'
import { verifyStep } from '@tests/step'
import { Target, target } from './Target'
import { TargetSelector, targetSelector } from './TargetSelector'

export class RelatedContentSection {
  constructor(
    readonly parent: Target,
    readonly title: TargetSelector<Locator>,
    readonly excerpt: TargetSelector<Locator>,
    readonly cta: TargetSelector<Locator>,
  ) {}

  shouldBeValid() {
    return verifyStep('related cards are valid', async ({ expect }) => {
      await this.parent.shouldHaveAtLeastOne().with(expect)
      const cardCount = await this.parent.locator.count()
      for (let i = 0; i < cardCount; i++) {
        const card = this.parent.locator.nth(i)
        await this.shouldHaveValidCard(card).with(expect)
      }
    })
  }

  shouldHaveValidCard(parent: Locator) {
    return verifyStep('related card is valid', async ({ expect }) => {
      await this.title.get(parent).shouldBeVisible(expect)
      await this.excerpt.get(parent).shouldBeVisible(expect)
      await this.cta.get(parent).shouldBeVisible(expect)
    })
  }
}

export function relatedContentSection(containerLocator: Locator) {
  return new RelatedContentSection(
    target('container for related', containerLocator),
    targetSelector('related card title', (card: Locator) => card.locator('.related-section-title')),
    targetSelector('related card excerpt', (card: Locator) => card.locator('.related-section-excerpt')),
    targetSelector('related card cta', (card: Locator) => card.locator('.related-section-cta')),
  )
}
