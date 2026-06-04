import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { visit } from '@tests/pages/shared/UserJourneyFactory'
import { ContentListPage, contentListPage } from '@tests/pages/content/ContentListPage'
import { contentListPath, contentDetailsPath } from '@tests/pages/shared/NavigationPaths'

export const userInWorkList = (page: Page, locale: UILanguages) =>
  visit(
    `a user in work list ${locale}`,
    page,
    contentListPath('work', locale),
    (p): ContentListPage => contentListPage(p, 'work'),
  )

export const userInWorkDetail = (page: Page, locale: UILanguages, slug: string) =>
  visit(
    `a user in work detail ${locale} ${slug}`,
    page,
    contentDetailsPath('work', locale, slug),
    (p): ContentListPage => contentListPage(p, 'work'),
  )
