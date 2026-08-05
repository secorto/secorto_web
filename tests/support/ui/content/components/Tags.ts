import type { Locator } from '@playwright/test'
import { step, verifyStep } from '@tests/fixtures'
import { Target, target, TargetSelector, targetSelector } from '@tests/support/ui/components/Target'

/**
 * Componente reutilizable para tags.
 * Patrón: Recibe Target + TargetSelector (DI), NO recibe page.
 * Selectores son inyectados, no hardcodeados.
 * Ejemplo: HighlightCard.ts
 */
export class TagsComponent {
  constructor(
    readonly container: Target,
    readonly tagLink: TargetSelector<string>,
  ) {}

  async filterByTag(tag: string) {
    return step(`Filter by tag "${tag}"`, async () => {
      await this.tagLink.get(tag).click()
    })
  }

  shouldRenderTags() {
    return verifyStep(`Tags are rendered`, async ({ expect }) => {
      await this.container.shouldBeVisible().with(expect)
      const tagCount = await this.container.locator.locator('[data-testid^="tag-link-"]').count()
      expect(tagCount).toBeGreaterThan(0)
    })
  }
}

/**
 * Factory inyecta los selectores.
 * Cambiar selector = modificar aquí (1 lugar).
 * Patrón: idéntico a highlightCards() en HighlightCard.ts
 */
export function tagsComponent(containerLocator: Locator) {
  return new TagsComponent(
    target('tags container', containerLocator),
    targetSelector(
      'tag link',
      (tag: string) => containerLocator.locator(`[href*="/tags/${tag}"]`),
      (tag: string) => tag,
    ),
  )
}
