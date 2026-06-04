import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { visit } from '@tests/pages/shared/UserJourneyFactory'
import { tagsPath } from '@tests/pages/shared/NavigationPaths'
import { TagsPage, tagsPage } from '@tests/pages/content/TagsPage'

export const userIsOnTags = (page: Page, locale: UILanguages) =>
  visit(
    `a user in tags ${locale}`,
    page,
    tagsPath(locale),
    (p): TagsPage => tagsPage(p),
  )
