import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import type { SectionType } from '@domain/section'
import type { ContentDetailPage } from './ContentDetailPage'
import type { ContentExperienceDetailPage } from './ContentExperienceDetailPage'

/**
 * Descriptor genérico para un flow de content type.
 * Cada content type (blog, project, work, etc.) exporta su propio descriptor.
 * Incluye: fixtures para tag a filtrar y slug de detalle a navegar.
 * Patrón: agnóstico, reutilizable, sin duplicación de imports en test.
 * El flujo: navegar a lista → filtrar por tag → clickear item con testSlug (sin navegar por URL).
 */
export interface ContentTypeFlow<ListPage> {
  readonly name: SectionType
  readonly testTag: string
  readonly testSlug: string
  readonly userInList: (page: Page, locale: UILanguages) => Promise<ListPage>
  readonly createDetail: (page: Page) => ContentDetailPage | ContentExperienceDetailPage
}
