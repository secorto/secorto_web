import type { UILanguages } from '@i18n/ui'
import type { SectionType } from '@domain/section'
import { getURLForSection } from '@utils/sections'

export function homePath(locale: UILanguages) {
  return `/${locale}/`
}

export function tagsPath(locale: UILanguages) {
  return `/${locale}/tags`
}

export function contentListPath(section: SectionType, locale: UILanguages) {
  return getURLForSection(section, locale)
}

export function contentDetailsPath(section: SectionType, locale: UILanguages, slug: string) {
  return `${contentListPath(section, locale)}/${slug}`
}

export function contentTagsPath(section: SectionType, locale: UILanguages, tag: string) {
  return `${contentListPath(section, locale)}/tags/${tag}`
}
