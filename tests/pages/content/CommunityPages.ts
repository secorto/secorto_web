import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { visit } from '@tests/pages/shared/UserJourneyFactory'
import { ContentListPage, contentListPage } from '@tests/pages/content/ContentListPage'
import { contentListPath, contentDetailsPath } from '@tests/pages/shared/NavigationPaths'

export const userInCommunityList = (page: Page, locale: UILanguages) =>
  visit(
    `a user in community list ${locale}`,
    page,
    contentListPath('community', locale),
    (p): ContentListPage => contentListPage(p, 'community'),
  )

export const userInCommunityDetail = (page: Page, locale: UILanguages, slug: string) =>
  visit(
    `a user in community detail ${locale} ${slug}`,
    page,
    contentDetailsPath('community', locale, slug),
    (p): ContentListPage => contentListPage(p, 'community'),
  )
