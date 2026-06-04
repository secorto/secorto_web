import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { visit } from '@tests/pages/shared/UserJourneyFactory'
import { ContentListPage, contentListPage } from '@tests/pages/content/ContentListPage'
import { contentListPath, contentDetailsPath } from '@tests/pages/shared/NavigationPaths'

export const userInTalkList = (page: Page, locale: UILanguages) =>
  visit(
    `a user in talk list ${locale}`,
    page,
    contentListPath('talk', locale),
    (p): ContentListPage => contentListPage(p, 'talk'),
  )

export const userInTalkDetail = (page: Page, locale: UILanguages, slug: string) =>
  visit(
    `a user in talk detail ${locale} ${slug}`,
    page,
    contentDetailsPath('talk', locale, slug),
    (p): ContentListPage => contentListPage(p, 'talk'),
  )
