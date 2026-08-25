import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import type { MainLayoutComponent } from '@tests/support/ui/shared/components/MainLayout'
import type { TagsComponent } from './components/Tags'
import type { ContentListComponent } from './components/ContentList'
import type { SectionType } from '@domain/section'
import { sectionsConfig, getURLForSection } from '@domain/section'
import { urlValidator } from '@tests/support/ui/shared/flows/urlValidator'
import { verifyStep } from '@tests/step'
import { visit } from '@tests/support/ui/shared/NavigationPaths'
import type { AuditablePage, Loadable, LocalizedPage, LocalizedUrl } from '@tests/support/ui/shared/contracts/localization'
import { mainLayout, defaultMainLayout } from '@tests/support/ui/shared/components/MainLayout'
import { target } from '@tests/support/ui/components/Target'
import { tagsComponent } from './components/Tags'
import { contentListComponent } from './components/ContentList'
import { a11yFlow, type A11y } from '@tests/support/ui/shared/flows/a11y'

/**
 * Main para listas de posts (blog, talk).
 * Valida que los items renderizados contienen PostDate en el slot.
 */
export class PostListPageMain implements LocalizedPage<void> {
  constructor(private page: Page) {}

  shouldBeLocalized(_locale: UILanguages) {
    return verifyStep('post list items have post-date', async ({ expect }) => {
      const firstItem = this.page.getByTestId('list-item').first()
      const postDate = firstItem.getByTestId('post-date')
      await expect(postDate).toBeVisible()
    })
  }
}

/**
 * Main para listas de experience (work, projects, community).
 * Valida que los items renderizados contienen role/responsibilities en el slot.
 */
export class ExperienceListPageMain implements LocalizedPage<void> {
  constructor(private page: Page) {}

  shouldBeLocalized(_locale: UILanguages) {
    return verifyStep('experience list items have role/responsibilities', async ({ expect }) => {
      const firstItem = this.page.getByTestId('list-item').first()
      const roleField = firstItem.getByTestId('post-role')
      const respField = firstItem.getByTestId('post-responsibilities')

      await expect(roleField).toBeVisible()
      await expect(respField).toBeVisible()
    })
  }
}

/**
 * Orquestador de página de lista.
 * Compone MainLayout + Tags + ContentList.
 */
export class ContentListPage implements Loadable, LocalizedPage<void>, LocalizedUrl, AuditablePage {
  constructor(
    readonly mainLayout: MainLayoutComponent,
    readonly tags: TagsComponent,
    readonly list: ContentListComponent,
    readonly validateUrl: ReturnType<typeof urlValidator>,
    readonly a11y: A11y,
  ) {}

  shouldBeLoaded() {
    return this.mainLayout.shouldBeLoaded()
  }

  shouldBeLocalized(locale: UILanguages) {
    return verifyStep('content list is localized', async ({ expect }) => {
      await this.shouldBeInLocale(locale).with(expect)
      await this.mainLayout.shouldBeLocalized(locale).with(expect)
      return this.tags.shouldRenderTags().with(expect)
    })
  }

  /**
   * Valida que la URL sea correcta para esta sección (sin redirects).
   * Ej: /es/blog, /en/project/, etc.
   */
  shouldBeInLocale(locale: UILanguages) {
    const expected = new RegExp(`/${locale}/[a-z0-9-]+(/|$)`)
    return this.validateUrl(expected)
  }

  auditA11y() {
    return this.a11y.audit()
  }

  /**
   * Valida que el filtrado por tag fue exitoso.
   * Comprueba: URL contiene /tags/${tag} (escapado) y lista tiene resultados.
   */
  shouldBeFiltered(tag: string) {
    return verifyStep(`content is filtered by tag ${tag}`, async ({ expect }) => {
      const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      await this.validateUrl(new RegExp(`/tags/${escapedTag}\/?$`)).with(expect)
      return this.list.shouldHaveResults().with(expect)
    })
  }

  /**
   * Abre un item específico por su href.
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
 * Factory unificado: crea ContentListPage automáticamente.
 * Selecciona el mainPageClass correcto según sectionName (post vs experience).
 */
export function contentListPage(
  page: Page,
  sectionName: SectionType,
): ContentListPage {
  const config = sectionsConfig[sectionName]
  const mainPageInstance = config.category === 'post'
    ? new PostListPageMain(page)
    : new ExperienceListPageMain(page)

  const layoutComponent = mainLayout({
    ...defaultMainLayout(page),
    name: `${sectionName} list`,
    headerTitle: target(`${sectionName} section title`, page.getByRole('heading', { level: 1 })),
    main: mainPageInstance,
  })
  const tagsComp = tagsComponent(page.locator('main'))
  const listComp = contentListComponent(page.locator('main'))
  return new ContentListPage(layoutComponent, tagsComp, listComp, urlValidator(page), a11yFlow(page))
}

/**
 * Navega a la página de lista de una sección y retorna el page object.
 */
export async function userIsOnContentList(
  page: Page,
  contentType: SectionType,
  locale: UILanguages,
): Promise<ContentListPage> {
  const url = getURLForSection(contentType, locale)
  return visit(
    `navigate to ${contentType} list in ${locale}`,
    page,
    url,
    (page) => contentListPage(page, contentType),
  )
}
