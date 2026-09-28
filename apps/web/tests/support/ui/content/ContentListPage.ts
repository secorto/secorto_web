import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import type { TagsComponent } from './components/Tags'
import type { ContentListComponent } from './components/ContentList'
import type { SectionType } from '@domain/section'
import { sectionRoutes } from '@domain/section'
import { step, verifyStep } from '@tests/step'
import { LocalizedNavigablePage, visit, createPageContext, type PageContext } from '@tests/support/ui/shared/pages'
import type { LocalizedPage } from '@tests/support/ui/shared/contracts/localization'
import { tagsComponent } from './components/Tags'
import { contentListComponent } from './components/ContentList'
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
 * Extiende LocalizedNavigablePage — implementa solo expectedUrl().
 *
 * Redefine shouldBeLocalized() porque tiene componentes adicionales (tags, list)
 * que necesitan validación y que otros Page Objects no tienen.
 * Esta es una excepción legítima, no una violación de LSP.
 */
export class ContentListPage extends LocalizedNavigablePage {
  constructor(
    context: PageContext,
    readonly section: SectionType,
    readonly tags: TagsComponent,
    readonly list: ContentListComponent,
  ) {
    super(context)
  }

  protected expectedUrl(locale: UILanguages): string | RegExp {
    // Valida que sea una sección válida (blog|talk|work|...), no cualquier cadena
    const validSections = sectionRoutes.getSections().join('|')
    return new RegExp(`/${locale}/(${validSections})(/|$)`)
  }

  shouldBeLocalized(locale: UILanguages) {
    return verifyStep('content list is localized', async ({ expect }) => {
      await this.shouldBeInLocale(locale).with(expect)
      await this.mainLayout.shouldBeLocalized(locale).with(expect)
      return this.tags.shouldRenderTags().with(expect)
    })
  }

  /**
   * Valida que el filtrado por tag fue exitoso.
   */
  shouldBeFiltered(locale: UILanguages, tag: Tag) {
    return verifyStep(`content is filtered by tag ${tag}`, async ({ expect }) => {
      const expectedTagPath = tagRoutes.getSectionTagPath(this.section, locale, tag)
      const escapedTagPath = expectedTagPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      await this.validateUrl(new RegExp(`${escapedTagPath}(/|$)`)).with(expect)
      return this.list.shouldHaveResults(expect)
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
 * Builder base para secciones tipo post.
 */
function buildPostListMain(page: Page): PostListPageMain {
  return new PostListPageMain(page)
}

/**
 * Builder base para secciones tipo experience.
 */
function buildExperienceListMain(page: Page): ExperienceListPageMain {
  return new ExperienceListPageMain(page)
}

/**
 * Factory unificado: cada sección se resuelve explícitamente a su builder base.
 */
const listMainFactories = {
  blog: buildPostListMain,
  talk: buildPostListMain,
  work: buildExperienceListMain,
  projects: buildExperienceListMain,
  community: buildExperienceListMain,
} satisfies Record<SectionType, (page: Page) => LocalizedPage<void>>

export function contentListPage(
  page: Page,
  sectionName: SectionType,
): ContentListPage {
  const mainPageInstance = listMainFactories[sectionName](page)
  const context = createPageContext(page, `${sectionName} list`, mainPageInstance)
  const tagsComp = tagsComponent(page.locator('main'))
  const listComp = contentListComponent(page.locator('main'))
  return new ContentListPage(context, sectionName, tagsComp, listComp)
}

/**
 * Navega a la página de lista de una sección y retorna el page object.
 */
export async function userIsOnContentList(
  page: Page,
  contentType: SectionType,
  locale: UILanguages,
): Promise<ContentListPage> {
  const sectionPath = sectionRoutes.getSectionPath(contentType, locale)
  return visit(
    `navigate to ${contentType} list in ${locale}`,
    page,
    sectionPath,
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
  const tagPath = tagRoutes.getSectionTagPath(contentType, locale, tag)
  return visit(
    `navigate to ${contentType} list in ${locale}`,
    page,
    tagPath,
    (page) => contentListPage(page, contentType),
  )
}
