import { getSectionRoute } from '@utils/sections'
import type { SectionType } from '@domain/section'
import type { UILanguages } from '@i18n/ui'
import type { ContentListPage } from '@tests/pages/ContentListPage'
import { test, type Page } from '@playwright/test'

export async function openCollectionList(page: Page, locale: UILanguages, collection: SectionType) {
  await test.step(`Open ${collection} list in ${locale}`, async () => {
    const route = getSectionRoute(collection, locale)
    await page.goto(`/${locale}/${route}`)
  })
}

function getItemPath(locale: UILanguages, collection: SectionType, itemPath: string) {
  const route = getSectionRoute(collection, locale)
  const href = `/${locale}/${route}/${itemPath}`
  const pattern = `${locale}/${route}/`
  return { pattern, href }
}

export async function openItem(list: ContentListPage, locale: UILanguages, collection: SectionType, itemPath: string) {
  await test.step(`Open ${collection} item ${itemPath} in ${locale}`, async () => {
    const { pattern, href } = getItemPath(locale, collection, itemPath)
    await Promise.all([
      list.page.waitForURL(new RegExp(pattern)),
      list.page.locator(`[href="${href}"]`).click()
    ])
  })
}
