import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import type { SectionType } from '@domain/section'
import { sectionRoutes } from '@domain/section'
import { buildUrlPattern } from '@tests/support/ui/shared/flows/urlValidation'
import { LocalizedNavigablePage, visit, createPageContext, type PageContext } from '@tests/support/ui/shared/pages'
import { target, type Target } from '@tests/support/ui/target/target'
import { verifyStep, type Step } from '@tests/step'
import type { LocalizedPage } from '@tests/support/ui/shared/contracts/localization'
import { Comments, giscusComments } from './components/Comments'

/**
 * Main component for detail pages with posts (blog, talk).
 * Validates presence of date and comments.
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
 * Main component for detail pages with experiences (work, projects, community).
 * Validates presence of required fields (role, responsibilities, website).
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

      // website is optional
      const websiteCount = await this.websiteLink.locator.count()
      if (websiteCount > 0) await expect(this.websiteLink.locator).toBeVisible()
    })
  }
}

/**
 * Builder for post-type detail sections.
 */
function buildPostDetailMain(page: Page): PostDetailMain {
  const dateContainer = page.getByTestId('post-date')
  const comments = giscusComments(page)
  return new PostDetailMain(target('post date', dateContainer), comments)
}

/**
 * Builder for experience-type detail sections.
 */
function buildExperienceDetailMain(page: Page): ExperienceDetailMain {
  const mainContainer = page.locator('main')
  return new ExperienceDetailMain(
    target('experience metadata', mainContainer),
    target('role field', mainContainer.getByTestId('post-role')),
    target('responsibilities field', mainContainer.getByTestId('post-responsibilities')),
    target('website link', mainContainer.getByTestId('post-website')),
  )
}

/**
 * Factory selector: each section is explicitly mapped to its builder.
 */
const detailMainFactories = {
  blog: buildPostDetailMain,
  talk: buildPostDetailMain,
  work: buildExperienceDetailMain,
  projects: buildExperienceDetailMain,
  community: buildExperienceDetailMain,
} satisfies Record<SectionType, (page: Page) => LocalizedPage<void>>

function buildDetailMain(
  page: Page,
  sectionName: SectionType,
): LocalizedPage<void> {
  return detailMainFactories[sectionName](page)
}

/**
 * Orchestrator for detail page. Validates section and slug in URL.
 */
export class ContentDetailPage extends LocalizedNavigablePage {
  constructor(
    context: PageContext,
    readonly section: SectionType,
    readonly slug: string,
  ) {
    super(context)
  }

  protected expectedUrl(locale: UILanguages): string | RegExp {
    const entryPath = sectionRoutes.getEntryPath(this.section, locale, this.slug)
    return buildUrlPattern(entryPath)
  }
}

/**
 * Creates ContentDetailPage instance.
 */
export function contentDetailPage(
  page: Page,
  sectionName: SectionType,
  slug: string,
): ContentDetailPage {
  const context = createPageContext(page, `${sectionName} detail`, buildDetailMain(page, sectionName))
  return new ContentDetailPage(context, sectionName, slug)
}

/**
 * Navigates to detail page.
 */
export function userIsOnContentDetail(
  page: Page,
  sectionName: SectionType,
  locale: UILanguages,
  slug: string,
): Step<ContentDetailPage> {
  const url = sectionRoutes.getEntryPath(sectionName, locale, slug)
  return visit(
    `a user in ${sectionName} detail ${locale} ${slug}`,
    page,
    url,
    (page) => contentDetailPage(page, sectionName, slug),
  )
}
