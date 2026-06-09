import type { Locator } from '@playwright/test'
import { step } from '@tests/fixtures'
import { link } from '@tests/pages/components/Link'

export class Highlight {
  constructor(readonly root: Locator) {}

  hrefMatches(locale: string, route: string) {
    // the highlight root is the anchor element in the Astro component
    return link('highlight link', this.root).hrefMatches(locale, route)
  }

  shouldBeVisible() {
    return step('highlight should be visible', async ({ expect }) => {
      await expect(this.root).toBeVisible()
    })
  }
}

export function highlight(locator: Locator) {
  return new Highlight(locator)
}
