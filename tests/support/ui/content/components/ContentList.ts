import type { Locator } from '@playwright/test'
import { step } from '@tests/step'
import { Target, target, TargetSelector, targetSelector } from '@tests/support/ui/components/Target'

/**
 * Componente reutilizable para lista de items.
 * Patrón: Recibe Target + TargetSelector (DI), NO recibe page.
 * Agnóstico a filtros: funciona en /es/blog y /es/blog/tags/python.
 */
export class ContentListComponent {
  constructor(
    readonly container: Target,
    readonly itemLink: TargetSelector<string>, // factory: dado href, retorna Locator
    readonly allItems: Target, // Target: todos los items (semántica explícita)
  ) {}

  async clickItem(href: string, title: string) {
    return step(`Click item: ${title}`, async () => {
      await this.itemLink.get(href).click()
    })
  }

  shouldHaveResults() {
    // Delega validación de "al menos un item" a Target.shouldHaveAtLeastOne()
    return this.allItems.shouldHaveAtLeastOne()
  }
}

/**
 * Factory inyecta selectores.
 */
export function contentListComponent(containerLocator: Locator) {
  return new ContentListComponent(
    target('content list', containerLocator),
    targetSelector(
      'list item link',
      (href: string) => containerLocator.locator(`[href="${href}"]`),
      (href: string) => href,
    ),
    target('all list items', containerLocator.getByTestId('list-item')),
  )
}
