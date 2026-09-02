import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import type { SectionType } from '@domain/section'
import { sectionRoutes, sectionsConfig } from '@domain/section'
import { NavigablePage, visit, createPageContext } from '@tests/support/ui/shared/pages'
import type { MainLayoutComponent } from '@tests/support/ui/shared/components/MainLayout'
import { target, type Target } from '@tests/support/ui/components/Target'
import { verifyStep, type Step } from '@tests/step'
import type { LocalizedPage } from '@tests/support/ui/shared/contracts/localization'
import { Comments, giscusComments } from './components/Comments'
import { type A11y } from '@tests/support/ui/shared/flows/a11y'

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

  shouldBeLocalized(locale: UILanguages) {
    return verifyStep('post detail (date + comments) is localized', async ({ expect }) => {
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

  shouldBeLocalized(_locale: UILanguages) {
    return verifyStep('experience detail (metadata) is localized', async ({ expect }) => {
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
 */
function buildDetailMain(
  page: Page,
  sectionName: SectionType,
): LocalizedPage<void> {
  const config = sectionsConfig[sectionName]

  if (config.category === 'post') {
    const dateContainer = page.getByTestId('post-date')
    const comments = giscusComments(page)
    return new PostDetailMain(target('post date', dateContainer), comments)
  } else {
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
 */
export class ContentDetailPage extends NavigablePage implements LocalizedPage<void> {
  constructor(
    mainLayout: MainLayoutComponent,
    a11y: A11y,
  ) {
    super(mainLayout, a11y)
  }

  shouldBeLocalized(locale: UILanguages) {
    return this.mainLayout.shouldBeLocalized(locale)
  }
}

/**
 * Factory principal: crea ContentDetailPage completo.
 */
export function contentDetailPage(
  page: Page,
  sectionName: SectionType,
): ContentDetailPage {
  const { layout, a11y } = createPageContext(page, `${sectionName} detail`, buildDetailMain(page, sectionName))
  return new ContentDetailPage(layout, a11y)
}

/**
 * Navega a la página de detalle de un entry y retorna el page object.
 * Encapsula: construcción de URL + instanciación de ContentDetailPage.
 */
export function userIsOnContentDetail(
  page: Page,
  sectionName: SectionType,
  locale: UILanguages,
  slug: string,
): Step<ContentDetailPage> {
  const url = sectionRoutes.getEntryURL(sectionName, locale, slug)
  return visit(
    `a user in ${sectionName} detail ${locale} ${slug}`,
    page,
    url,
    (page) => contentDetailPage(page, sectionName),
  )
}
