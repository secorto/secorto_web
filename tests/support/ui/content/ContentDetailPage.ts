import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import type { SectionType } from '@domain/section'
import type { MainLayoutComponent } from '@tests/support/ui/shared/components/MainLayout'
import { mainLayout, defaultMainLayout } from '@tests/support/ui/shared/components/MainLayout'
import { target } from '@tests/support/ui/components/Target'
import type { Comments } from './components/Comments'
import { giscusComments } from './components/Comments'
import { PostListPageMain } from './ContentListPage'

/**
 * Orquestador de página de detalle (blog, talk).
 * Compone MainLayout + CommentsComponent.
 */
export class ContentDetailPage {
  constructor(
    readonly mainLayout: MainLayoutComponent,
    readonly comments: Comments,
  ) {}

  shouldBeLoaded(locale: UILanguages) {
    return this.mainLayout.shouldBeLoaded(locale)
  }
}

/**
 * Crea ContentDetailPage para posts (blog, talk).
 * Encapsula mainLayout + giscusComments.
 */
export function createPostDetail(
  page: Page,
  sectionName: SectionType,
): ContentDetailPage {
  const layoutComponent = mainLayout({
    ...defaultMainLayout(page),
    name: `${sectionName} detail`,
    headerTitle: target(`${sectionName} detail title`, page.getByRole('heading', { level: 1 })),
    main: new PostListPageMain(sectionName),
  })
  const commentsComp = giscusComments(page)
  return new ContentDetailPage(layoutComponent, commentsComp)
}
