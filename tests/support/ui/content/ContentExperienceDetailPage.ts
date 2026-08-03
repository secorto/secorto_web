import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import type { SectionType } from '@domain/section'
import type { MainLayoutComponent } from '@tests/support/ui/shared/components/MainLayout'
import { mainLayout, defaultMainLayout } from '@tests/support/ui/shared/components/MainLayout'
import { target } from '@tests/support/ui/components/Target'
import type { ContentDetailComponent } from './components/ContentDetail'
import { contentDetailComponent } from './components/ContentDetail'
import { ExperienceListPageMain } from './ContentListPage'

/**
 * Orquestador de página de detalle (work, project, community).
 * Compone MainLayout + ContentDetailComponent.
 */
export class ContentExperienceDetailPage {
  constructor(
    readonly mainLayout: MainLayoutComponent,
    readonly detail: ContentDetailComponent,
  ) {}

  shouldBeLoaded(locale: UILanguages) {
    return this.mainLayout.shouldBeLoaded(locale)
  }

  shouldHaveRole(expectedRole: string) {
    return this.detail.shouldHaveRole(expectedRole)
  }

  shouldHaveResponsibilities(expectedResponsibilities: string) {
    return this.detail.shouldHaveResponsibilities(expectedResponsibilities)
  }

  shouldHaveWebsite(expectedWebsite: string) {
    return this.detail.shouldHaveWebsite(expectedWebsite)
  }
}

/**
 * Crea ContentExperienceDetailPage para experiencias (work, project, community).
 * Encapsula mainLayout + contentDetailComponent.
 */
export function createExperienceDetail(
  page: Page,
  sectionName: SectionType,
): ContentExperienceDetailPage {
  const layoutComponent = mainLayout({
    ...defaultMainLayout(page),
    name: `${sectionName} detail`,
    headerTitle: target(`${sectionName} detail title`, page.getByRole('heading', { level: 1 })),
    main: new ExperienceListPageMain(sectionName),
  })
  const detailComp = contentDetailComponent(page.locator('main'))
  return new ContentExperienceDetailPage(layoutComponent, detailComp)
}
