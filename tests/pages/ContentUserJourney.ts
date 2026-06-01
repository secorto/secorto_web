import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { ui } from '@i18n/ui'
import type { TranslationKey } from '@domain/section'
import { step } from '@tests/fixtures'
import { ContentListPage } from '@tests/pages/ContentListPage'

// ─── List base ───────────────────────────────────────────────────────────────

export class ContentListJourney {
  constructor(
    readonly page: Page,
    readonly list: ContentListPage,
    readonly locale: UILanguages,
    readonly titleKey: TranslationKey,
  ) {}

  shouldHaveTitle() {
    return step('list has page title and header', async ({ expect }) => {
      const expected = ui[this.locale][this.titleKey]
      await expect(this.page).toHaveTitle(`${expected} | SeCOrTo`)
      await expect(this.list.headerTitle()).toHaveText(expected)
    })
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
    return step(`detail has title "${expected}"`, async ({ expect }) => {
      await expect(this.list.headerTitle()).toHaveText(expected)
    })
  }
}

// ─── WorkProjectCommunity detail (shared fields) ─────────────────────────────

export class WorkProjectCommunityDetailJourney extends ContentDetailJourney {
  shouldHaveRole(expected: string) {
    return step(`detail has role "${expected}"`, async ({ expect }) => {
      await expect(this.list.postRole()).toHaveText(expected)
    })
  }

  shouldHaveResponsibilities(expected: string) {
    return step(`detail has responsibilities "${expected}"`, async ({ expect }) => {
      await expect(this.list.postResponsibilities()).toHaveText(expected)
    })
  }

  shouldHaveWebsite(expected: string) {
    return step(`detail has website "${expected}"`, async ({ expect }) => {
      await expect(this.list.postWebsite()).toHaveAttribute('href', expected)
    })
  }
}
