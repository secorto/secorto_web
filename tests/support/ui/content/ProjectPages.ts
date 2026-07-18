import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { ContentListPage, contentListPage } from '@tests/support/ui/content/ContentListPage'
import { ContentDetailPage, contentDetailPage } from '@tests/support/ui/content/ContentDetailPage'
import { contentListPath, contentDetailsPath, visit } from '@tests/support/ui/shared/NavigationPaths'

export const userInProjectList = (page: Page, locale: UILanguages) =>
  visit(
    `a user in project list ${locale}`,
    page,
    contentListPath('projects', locale),
    (p): ContentListPage => contentListPage(p, 'project'),
  )

export const userInProjectDetail = (page: Page, locale: UILanguages, slug: string) =>
  visit(
    `a user in project detail ${locale} ${slug}`,
    page,
    contentDetailsPath('projects', locale, slug),
    (p): ContentDetailPage => contentDetailPage(p, 'project'),
  )
