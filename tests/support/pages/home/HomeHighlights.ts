import type { Locator } from '@playwright/test'
import { highlight } from '@tests/support/pages/home/Highlight'
import type { Highlight as HighlightComponent } from '@tests/support/pages/home/Highlight'
import { callout } from '@tests/support/pages/content/Callout'
import type { Callout as CalloutComponent } from '@tests/support/pages/content/Callout'

export class HomeHighlights {
  readonly blog: HighlightComponent
  readonly talk: HighlightComponent
  readonly pybaq: CalloutComponent

  constructor(readonly root: Locator) {
    this.blog = highlight(this.root.getByTestId('highlight-blog'))
    this.talk = highlight(this.root.getByTestId('highlight-talk'))
    this.pybaq = callout(this.root.locator('.pybaq-callout'))
  }
}

export function homeHighlights(locator: Locator) {
  return new HomeHighlights(locator)
}
