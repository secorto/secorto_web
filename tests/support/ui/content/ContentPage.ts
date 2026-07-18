import type { Page } from '@playwright/test'
import { target } from '@tests/support/ui/components/Target'
import type { Target as TargetComponent } from '@tests/support/ui/components/Target'

/**
 * Base class for content pages (list, detail, tagged).
 * Contains shared structure and properties common to all content pages.
 */
export class ContentPage {
  constructor(
    readonly name: string,
    readonly headerTitle: TargetComponent,
    readonly tags: TargetComponent,
  ) {}
}

export function createContentPage(page: Page, name: string): ContentPage {
  return new ContentPage(
    name,
    target(`${name} header title`, page.getByTestId('header-title')),
    target(`${name} tags`, page.getByTestId('tags')),
  )
}
