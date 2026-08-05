import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import type { SectionType } from '@domain/section'
import { sectionsConfig } from '@domain/section'
import type { MainLayoutComponent } from '@tests/support/ui/shared/components/MainLayout'
import { mainLayout, defaultMainLayout } from '@tests/support/ui/shared/components/MainLayout'
import { target, type Target } from '@tests/support/ui/components/Target'
import { verifyStep } from '@tests/fixtures'
import type { LocalizedPage } from '@tests/support/ui/shared/contracts/localization'
import { Comments, giscusComments } from './components/Comments'

/**
 * Main component para posts (blog, talk) en página de detalle.
 * Valida presencia de date + comments.
 * Implementa LocalizedPage: es el componente principal de la página.
 */
export class PostDetailMain implements LocalizedPage<void> {
  constructor(
    readonly dateField: Target,
    readonly comments: Comments,
  ) {}

  shouldBeLoaded(locale: UILanguages) {
    return verifyStep('post detail (date + comments) is loaded', async ({ expect }) => {
      await expect(this.dateField.locator).toBeVisible()
      await this.comments.shouldBeReady(locale).with(expect)
    })
  }
}

/**
 * Main component para experiences (work, projects, community) en página de detalle.
 * Valida presencia de campos obligatorios (role, responsibilities, website).
 * Implementa LocalizedPage: es el componente principal de la página.
 */
export class ExperienceDetailMain implements LocalizedPage<void> {
  constructor(
    readonly container: Target,
    readonly roleField: Target,
    readonly responsibilitiesField: Target,
    readonly websiteLink: Target,
  ) {}

  shouldBeLoaded() {
    return verifyStep('experience detail (metadata) is loaded', async ({ expect }) => {
      await expect(this.container.locator).toBeVisible()
      await expect(this.roleField.locator).toBeVisible()
      await expect(this.responsibilitiesField.locator).toBeVisible()

      // website es opcional
      const websiteCount = await this.websiteLink.locator.count()
      if (websiteCount > 0) await expect(this.websiteLink.locator).toBeVisible()
    })
  }
}

/**
 * Factory selector: crea el main component según categoría (post vs experience).
 * Lee sectionsConfig para determinar qué tipo crear.
 */
function buildDetailMain(
  page: Page,
  sectionName: SectionType,
): LocalizedPage<void> {
  const config = sectionsConfig[sectionName]

  if (config.category === 'post') {
    // Posts: blog, talk → PostDetailMain (valida date + comments)
    const dateContainer = page.getByTestId('post-date')
    const comments = giscusComments(page)
    return new PostDetailMain(target('post date', dateContainer), comments)
  } else {
    // Experiences: work, projects, community → ExperienceDetailMain
    const mainContainer = page.locator('main')
    return new ExperienceDetailMain(
      target('experience metadata', mainContainer),
      target('role field', mainContainer.getByTestId('post-role')),
      target('responsibilities field', mainContainer.getByTestId('post-responsibilities')),
      target('website link', mainContainer.getByTestId('post-website')),
    )
  }
}

/**
 * Orquestador de página de detalle.
 * Compone MainLayout + el componente main (PostDetailMain o ExperienceDetailMain).
 * Patrón simple: mainLayout es el contenedor, main es el contenido específico.
 */
export class ContentDetailPage {
  constructor(
    readonly mainLayout: MainLayoutComponent,
  ) {}

  shouldBeLoaded(locale: UILanguages) {
    return this.mainLayout.shouldBeLoaded(locale)
  }
}

/**
 * Factory principal: crea ContentDetailPage completo.
 * Orquesta mainLayout + main component (post o experience).
 * Selecciona automáticamente según sectionName.
 */
export function contentDetailPage(
  page: Page,
  sectionName: SectionType,
): ContentDetailPage {
  const layoutComponent = mainLayout({
    ...defaultMainLayout(page),
    name: `${sectionName} detail`,
    headerTitle: target(`${sectionName} detail title`, page.getByRole('heading', { level: 1 })),
    main: buildDetailMain(page, sectionName),
  })

  return new ContentDetailPage(layoutComponent)
}
