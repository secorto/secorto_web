import { getSectionRoute, type SectionType } from '@config/sections'
import type { UILanguages } from '@i18n/ui'
import type { ContentListPage } from '@tests/pages/ContentListPage'
import type { Page } from '@playwright/test'

export async function goto(page: Page, locale: UILanguages, collection: SectionType) {
  const route = getSectionRoute(collection, locale)
  await page.goto(`/${locale}/${route}`)
}

export function getItemPath(locale: UILanguages, collection: SectionType, itemPath: string) {
  const route = getSectionRoute(collection, locale)
  const href = `/${locale}/${route}/${itemPath}`
  const pattern = `${locale}/${route}/`
  return { pattern, href }
}

export async function openItem(list: ContentListPage, locale: UILanguages, collection: SectionType, itemPath: string) {
  const { pattern, href } = getItemPath(locale, collection, itemPath)
  await Promise.all([
    list.page.waitForURL(new RegExp(pattern)),
    list.page.locator(`[href="${href}"]`).click()
  ])
}
