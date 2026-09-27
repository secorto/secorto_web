import type { Locator } from '@playwright/test'
import { step, type ExpectLike } from '@tests/step'
import { target, type TargetComponent } from '@tests/support/ui/target/target'
import { collection, type Collection } from '@tests/support/ui/target/collection'
import { TargetSelector, targetSelector } from '@tests/support/ui/target/targetSelector'

/**
 * Componente reutilizable para lista de items.
 * Patrón: Recibe Target + TargetSelector (DI), NO recibe page.
 * Agnóstico a filtros: funciona en /es/blog y /es/blog/tags/python.
 */
export class ContentListComponent {
  constructor(
    readonly container: TargetComponent,
    readonly itemLink: TargetSelector<string, TargetComponent>,
    readonly allItems: Collection,
  ) {}

  clickItem(href: string, title: string) {
    return step(`Click item: ${title}`, async () => {
      await this.itemLink.get(href).click()
    })
  }

  shouldHaveResults(expect: ExpectLike) {
    return this.allItems.should.haveAtLeastOne(expect)
  }
}

/**
 * Factory inyecta selectores.
 */
export function contentListComponent(containerLocator: Locator) {
  return new ContentListComponent(
    target('content list', containerLocator),
    targetSelector(
      target,
      'list item link',
      (href: string) => containerLocator.locator(`[href="${href}"]`),
      (href: string) => href,
    ),
    collection('all list items', containerLocator.getByTestId('list-item')),
  )
}
