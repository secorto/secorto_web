import type { Locator } from '@playwright/test'
import { createUIComponents } from '@secorto/ui-components'
import { HighlightCards } from '@tests/support/ui/components/HighlightCard'
import { step, verifyStep } from './index'

const uiComponents = createUIComponents(step, verifyStep)

export const { target, image, link, pageHelper, targetSelector, specializedTargetSelector } = uiComponents

export const highlightCards = (containerLocator: Locator) => {
  return new HighlightCards(
    uiComponents.target('container for highlight', containerLocator),
    uiComponents.targetSelector('highlight card title', (card: Locator) => card.locator('.highlight-title')),
    uiComponents.targetSelector('highlight card excerpt', (card: Locator) => card.locator('.highlight-excerpt')),
    uiComponents.targetSelector('highlight card cta', (card: Locator) => card.locator('.highlight-cta')),
    verifyStep,
  )
}
