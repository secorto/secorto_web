import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import type { MainLayoutComponent } from '@tests/support/ui/shared/components/MainLayout'
import type { TagsComponent } from './components/Tags'
import type { ContentListComponent } from './components/ContentList'
import type { SectionType } from '@domain/section'
import { sectionRoutes, sectionsConfig } from '@domain/section'
import { urlValidator } from '@tests/support/ui/shared/flows/urlValidator'
import { step, verifyStep } from '@tests/step'
import { NavigablePage, visit, createPageContext } from '@tests/support/ui/shared/pages'
import type { LocalizedPage, LocalizedUrl } from '@tests/support/ui/shared/contracts/localization'
import { tagsComponent } from './components/Tags'
import { contentListComponent } from './components/ContentList'
import { type A11y } from '@tests/support/ui/shared/flows/a11y'
import { tagRoutes, type Tag } from '@domain/tags'

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
export class ContentListPage extends NavigablePage implements LocalizedPage<void>, LocalizedUrl {
  constructor(
    readonly section: SectionType,
    mainLayout: MainLayoutComponent,
    readonly tags: TagsComponent,
    readonly list: ContentListComponent,
    readonly validateUrl: ReturnType<typeof urlValidator>,
    a11y: A11y,
  ) {
    super(mainLayout, a11y)
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

  /**
   * Valida que el filtrado por tag fue exitoso.
   */
  shouldBeFiltered(locale: UILanguages, tag: Tag) {
    return verifyStep(`content is filtered by tag ${tag}`, async ({ expect }) => {
      const expectedUrl = tagRoutes.getSectionTagURL(this.section, locale, tag)
      const escapedUrl = expectedUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      await this.validateUrl(new RegExp(`${escapedUrl}(/|$)`)).with(expect)
      return this.list.shouldHaveResults().with(expect)
    })
  }

  /**
   * Abre un item específico por su href.
   */
  async openItem(href: string) {
    return step(`open item ${href}`, async () => {
      const slug = href.split('/').pop() || 'item'
      const title = slug.replace(/-/g, ' ')
      return this.list.clickItem(href, title)
    })
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

  const { layout, validateUrl, a11y } = createPageContext(page, `${sectionName} list`, mainPageInstance)
  const tagsComp = tagsComponent(page.locator('main'))
  const listComp = contentListComponent(page.locator('main'))
  return new ContentListPage(sectionName, layout, tagsComp, listComp, validateUrl, a11y)
}

/**
 * Navega a la página de lista de una sección y retorna el page object.
 */
export async function userIsOnContentList(
  page: Page,
  contentType: SectionType,
  locale: UILanguages,
): Promise<ContentListPage> {
  const url = sectionRoutes.getSectionURL(contentType, locale)
  return visit(
    `navigate to ${contentType} list in ${locale}`,
    page,
    url,
    (page) => contentListPage(page, contentType),
  )
}

/**
 * Navega a la página de lista por tag de una sección y retorna el page object.
 */
export async function userInContentTag(
  page: Page,
  contentType: SectionType,
  locale: UILanguages,
  tag: Tag
): Promise<ContentListPage> {
  const url = tagRoutes.getSectionTagURL(contentType, locale, tag)
  return visit(
    `navigate to ${contentType} list in ${locale}`,
    page,
    url,
    (page) => contentListPage(page, contentType),
  )
}
