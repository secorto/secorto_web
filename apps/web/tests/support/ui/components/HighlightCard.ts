import type { Locator } from '@playwright/test'
import type { VerifyStepFn } from '@secorto/step'
import { Target, TargetSelector } from '@secorto/ui-components'

export class HighlightCards {
  constructor(
    readonly parent: Target,
    readonly title: TargetSelector<Locator>,
    readonly excerpt: TargetSelector<Locator>,
    readonly cta: TargetSelector<Locator>,
    private verifyStep: VerifyStepFn,
  ) {}

  shouldBeValid() {
    return this.verifyStep('highlight cards are valid', async ({ expect }) => {
      const cardCount = await this.parent.locator.count()
      expect(cardCount).toBeGreaterThan(0)
      for (let i = 0; i < cardCount; i++) {
        const card = this.parent.locator.nth(i)
        await this.shouldHaveValidCard(card).with(expect)
      }
    })
  }

  shouldHaveValidCard(parent: Locator) {
    return this.verifyStep('highlight card is valid', async ({ expect }) => {
      await this.title.get(parent).shouldBeVisible().with(expect)
      await this.excerpt.get(parent).shouldBeVisible().with(expect)
      await this.cta.get(parent).shouldBeVisible().with(expect)
    })
  }
}
