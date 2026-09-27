import type { Locator } from '@playwright/test'
import { verifyStep } from '@tests/step'
import { target, type TargetComponent } from '@tests/support/ui/target/target'
import { collection, type Collection } from '@tests/support/ui/target/collection'
import { TargetSelector, targetSelector } from '@tests/support/ui/target/targetSelector'

export class RelatedContentSection {
  constructor(
    readonly parent: Collection,
    readonly title: TargetSelector<Locator, TargetComponent>,
    readonly excerpt: TargetSelector<Locator, TargetComponent>,
    readonly cta: TargetSelector<Locator, TargetComponent>,
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
      await this.title.get(parent).should.beVisible(expect)
      await this.excerpt.get(parent).should.beVisible(expect)
      await this.cta.get(parent).should.beVisible(expect)
    })
  }
}

export function relatedContentSection(containerLocator: Locator) {
  return new RelatedContentSection(
    collection('container for related', containerLocator),
    targetSelector(target, 'related card title', (card: Locator) => card.locator('.related-section-title')),
    targetSelector(target, 'related card excerpt', (card: Locator) => card.locator('.related-section-excerpt')),
    targetSelector(target, 'related card cta', (card: Locator) => card.locator('.related-section-cta')),
  )
}
