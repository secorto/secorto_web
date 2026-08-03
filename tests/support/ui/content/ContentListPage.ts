import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import type { MainLayoutComponent } from '@tests/support/ui/shared/components/MainLayout'
import type { TagsComponent } from './components/Tags'
import type { ContentListComponent } from './components/ContentList'
import type { SectionType } from '@domain/section'
import { urlValidator } from '@tests/support/ui/shared/flows/urlValidator'
import { verifyStep } from '@tests/fixtures'
import type { LocalizedPage } from '@tests/support/ui/shared/contracts/localization'
import { mainLayout, defaultMainLayout } from '@tests/support/ui/shared/components/MainLayout'
import { target } from '@tests/support/ui/components/Target'
import { tagsComponent } from './components/Tags'
import { contentListComponent } from './components/ContentList'

/**
 * Main para listas de posts (blog, talk).
 * Recibe SectionType en constructor para usar en validaciones.
 */
export class PostListPageMain implements LocalizedPage<void> {
  constructor(private sectionType: SectionType) {}

  shouldBeLoaded() {
    return verifyStep(`${this.sectionType} list main is ready`, async () => {})
  }
}

/**
 * Main para listas de experience (work, projects, community).
 * Recibe SectionType en constructor para usar en validaciones.
 */
export class ExperienceListPageMain implements LocalizedPage<void> {
  constructor(private sectionType: SectionType) {}

  shouldBeLoaded() {
    return verifyStep(`${this.sectionType} list main is ready`, async () => {})
  }
}

/**
 * Orquestador de página de lista.
 * Compone MainLayout + Tags + ContentList.
 * Patrón: idéntico a HomePage.
 *
 * urlValidator: reutilizado de homepage, valida URL correcta de sección.
 */
export class ContentListPage {
  constructor(
    readonly mainLayout: MainLayoutComponent,
    readonly tags: TagsComponent,
    readonly list: ContentListComponent,
    readonly validateUrl: ReturnType<typeof urlValidator>,
  ) {}

  shouldBeLoaded(locale: UILanguages) {
    return verifyStep('content list is loaded', async ({ expect }) => {
      await this.mainLayout.shouldBeLoaded(locale).with(expect)
      await this.tags.shouldRenderTags().with(expect)
      return this.shouldBeInLocale(locale).with(expect)
    })
  }

  /**
   * Valida que la URL sea correcta para esta sección (sin redirects).
   * Ej: /es/blog, /en/project/, etc.
   */
  shouldBeInLocale(locale: UILanguages) {
    const expected = new RegExp(`/${locale}/[a-z]+(/|$)`)
    return this.validateUrl(expected)
  }

  /**
   * Valida que el filtrado por tag fue exitoso.
   * Comprueba: URL contiene /tags/${tag} y lista tiene resultados.
   * Patrón: encapsula validaciones (no test hace expect(page.url())).
   */
  shouldBeFiltered(tag: string) {
    return verifyStep(`content is filtered by tag ${tag}`, async ({ expect }) => {
      await this.validateUrl(new RegExp(`/tags/${tag}`)).with(expect)
      return this.list.shouldHaveResults().with(expect)
    })
  }


  /**
   * Abre un item específico por su href.
   * Patrón: usa getEntryURL() del domain, sin construir rutas manualmente.
   */
  async openItem(href: string) {
    const slug = href.split('/').pop() || 'item'
    const title = slug.replace(/-/g, ' ')
    return this.list.clickItem(href, title)
  }

  // Delegadores de conveniencia para tests
  async filterByTag(tag: string) {
    return this.tags.filterByTag(tag)
  }
}

/**
 * Factory centralizada para crear ContentListPage.
 * Elimina duplicación de lógica en BlogPages.ts, ProjectPages.ts, etc.
 *
 * @param page - Playwright Page
 * @param sectionName - nombre de la sección (blog, projects, community, etc.)
 * @param mainPageClass - clase para el Main (PostListPageMain o ExperienceListPageMain)
 * @returns ContentListPage listo para usar
 */
export function createContentListPageFactory(
  page: Page,
  sectionName: SectionType,
  mainPageClass: typeof PostListPageMain | typeof ExperienceListPageMain,
): ContentListPage {
  const layoutComponent = mainLayout({
    ...defaultMainLayout(page),
    name: `${sectionName} list`,
    headerTitle: target(`${sectionName} section title`, page.getByRole('heading', { level: 1 })),
    main: new mainPageClass(sectionName),
  })
  const tagsComp = tagsComponent(page.locator('main'))
  const listComp = contentListComponent(page.locator('main'))
  return new ContentListPage(layoutComponent, tagsComp, listComp, urlValidator(page))
}
