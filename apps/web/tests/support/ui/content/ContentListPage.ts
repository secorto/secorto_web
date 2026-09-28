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
 * Main component for list pages with posts (blog, talk).
 * Validates that rendered items contain PostDate in the slot.
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
 * Main component for list pages with experiences (work, projects, community).
 * Validates that rendered items contain role/responsibilities in the slot.
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
 * Orchestrator for content list pages. Validates list, tags, and URL patterns.
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
    const sectionPath = sectionRoutes.getSectionPath(this.section, locale)
    return new RegExp(`${sectionPath}(/|$)`)
  }

  shouldBeLocalized(locale: UILanguages) {
    return verifyStep('content list is localized', async ({ expect }) => {
      await this.shouldBeInLocale(locale).with(expect)
      await this.mainLayout.shouldBeLocalized(locale).with(expect)
      return this.tags.shouldRenderTags().with(expect)
    })
  }

  /**
   * Validates that content is filtered by tag.
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
   * Opens a list item by href.
   */
  async openItem(href: string) {
    return step(`open item ${href}`, async () => {
      const slug = href.split('/').pop() || 'item'
      const title = slug.replace(/-/g, ' ')
      return this.list.clickItem(href, title)
    })
  }

  // Convenience delegators for tests
  async filterByTag(tag: string) {
    return this.tags.filterByTag(tag)
  }
}

/**
 * Builder for post-type list sections.
 */
function buildPostListMain(page: Page): PostListPageMain {
  return new PostListPageMain(page)
}

/**
 * Builder for experience-type list sections.
 */
function buildExperienceListMain(page: Page): ExperienceListPageMain {
  return new ExperienceListPageMain(page)
}

/**
 * Factory selector: each section is explicitly mapped to its builder.
 */
const listMainFactories = {
  blog: buildPostListMain,
  talk: buildPostListMain,
  work: buildExperienceListMain,
  projects: buildExperienceListMain,
  community: buildExperienceListMain,
} satisfies Record<SectionType, (page: Page) => LocalizedPage<void>>

/**
 * Creates ContentListPage instance.
 */
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
 * Navigates to content list page.
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
 * Navigates to content list page filtered by tag.
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
