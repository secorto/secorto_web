import type { Page } from '@playwright/test'
import { target } from '@tests/support/ui/components/Target'
import type { Target as TargetComponent } from '@tests/support/ui/components/Target'
import { ContentPage, createContentPage } from '@tests/support/ui/content/ContentPage'

/**
 * Page Object for content detail views with professional experience metadata
 * (work, projects, community).
 * Specialization of ContentPage that guarantees role, responsibilities, and website fields.
 */
export class ContentExperienceDetailPage extends ContentPage {
  constructor(
    name: string,
    headerTitle: TargetComponent,
    tags: TargetComponent,
    readonly postRole: TargetComponent,
    readonly postResponsibilities: TargetComponent,
    readonly postWebsite: TargetComponent,
  ) {
    super(name, headerTitle, tags)
  }

  shouldHaveRole(expected: string) {
    return this.postRole.shouldHaveText(expected)
  }

  shouldHaveResponsibilities(expected: string) {
    return this.postResponsibilities.shouldHaveText(expected)
  }

  shouldHaveWebsite(expected: string) {
    return this.postWebsite.shouldHaveAttribute('href', expected)
  }
}

/**
 * Factory for creating ContentExperienceDetailPage with experience-specific elements.
 * Used for content types with professional metadata (work, projects, community).
 */
export function contentExperienceDetailPage(page: Page, name: string): ContentExperienceDetailPage {
  const basePage = createContentPage(page, name)
  return new ContentExperienceDetailPage(
    basePage.name,
    basePage.headerTitle,
    basePage.tags,
    target(`${name} role`, page.getByTestId('post-role')),
    target(`${name} responsibilities`, page.getByTestId('post-responsibilities')),
    target(`${name} website`, page.getByTestId('post-website')),
  )
}
