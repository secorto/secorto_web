import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { ui } from '@i18n/ui'
import type { TranslationKey } from '@domain/section'
import { step } from '@tests/fixtures'
import { ContentListPage } from '@tests/pages/content/ContentListPage'
import { pageHelper } from '@tests/pages/components/PageHelper'

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// ─── List base ───────────────────────────────────────────────────────────────

export class ContentListJourney {
  constructor(
    readonly page: Page,
    readonly list: ContentListPage,
    readonly locale: UILanguages,
    readonly titleKey: TranslationKey,
  ) {}

  shouldHaveTitle() {
    const expected = ui[this.locale][this.titleKey]
    const expectedPageTitle = new RegExp(`^${escapeRegExp(expected)} \\| SeCOrTo$`)
    const pageTitleStep = pageHelper(this.page).shouldHaveTitle(expectedPageTitle)
    const headerStep = this.list.shouldHaveListHeaderTitle(expected)

    return step('list has page title and header', async (stepExpect) => {
      await pageTitleStep.action(stepExpect)
      await headerStep.action(stepExpect)
    })
  }

  filterByTag(tag: string) {
    return this.list.filterByTag(tag)
  }

  shouldShowFilteredTitle(tag: string) {
    return this.list.shouldHaveFilteredTitle(ui[this.locale][this.titleKey], tag)
  }

  verifyTagsForSection() {
    return this.list.shouldRenderTagsForSection()
  }
}

// ─── Detail base ─────────────────────────────────────────────────────────────

export class ContentDetailJourney {
  constructor(
    readonly page: Page,
    readonly list: ContentListPage,
    readonly locale: UILanguages,
  ) {}

  shouldHaveTitle(expected: string) {
    return this.list.shouldHaveDetailTitle(expected)
  }
}

// ─── WorkProjectCommunity detail (shared fields) ─────────────────────────────

export class WorkProjectCommunityDetailJourney extends ContentDetailJourney {
  shouldHaveRole(expected: string) {
    return this.list.shouldHaveRole(expected)
  }

  shouldHaveResponsibilities(expected: string) {
    return this.list.shouldHaveResponsibilities(expected)
  }

  shouldHaveWebsite(expected: string) {
    return this.list.shouldHaveWebsite(expected)
  }
}
