import { getURLForSection } from '@utils/sections'
import type { SectionType } from '@domain/section'
import type { UILanguages } from '@i18n/ui'
import { test, type Page } from '@playwright/test'

export async function openCollectionList(page: Page, locale: UILanguages, collection: SectionType) {
  await test.step(`Open ${collection} list in ${locale}`, async () => {
    await page.goto(getURLForSection(collection, locale))
  })
}

export async function clickLinkItem(page: Page, locale: UILanguages, collection: SectionType, itemPath: string) {
  await test.step(`Open ${collection} item ${itemPath} in ${locale}`, async () => {
    const href = `${getURLForSection(collection, locale)}/${itemPath}`
    await page.locator(`[href="${href}"]`).click()
  })
}
