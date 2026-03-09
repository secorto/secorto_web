/**
 * Translation utilities for determining locale availability.
 *
 * All functions are pure and synchronous — callers must fetch collection entries with
 * `getCollection` before calling these helpers. This avoids redundant `getCollection`
 * calls when the caller already has entries at hand.
 */
import type { CollectionEntry, CollectionKey } from 'astro:content'
import type { UILanguages } from '@i18n/ui'
import { languageKeys } from '@i18n/ui'
import { extractCleanId } from './ids'
import type { AvailableLocales } from '@i18n/languagePickerUtils'
import type { TagMap } from '@domain/tags'

/**
 * Build a map of available locales for a content entry, including slug and draft status.
 * Used by detail pages to build LanguagePicker links.
 *
 * @param allEntries - Pre-fetched collection entries (caller calls getCollection)
 * @param cleanId - Entry slug/ID without locale prefix
 * @returns AvailableLocales map: locale -> { slug, draft? }
 */
export function getAvailableLocaleEntries(
  allEntries: CollectionEntry<CollectionKey>[],
  cleanId: string
): AvailableLocales {
  const result: AvailableLocales = {}

  for (const lang of languageKeys) {
    const entry = allEntries.find(
      (e) => e.id.startsWith(`${lang}/`) && extractCleanId(e.id) === cleanId
    )
    if (entry) {
      result[lang] = {
        slug: extractCleanId(entry.id),
        draft: Boolean(entry.data?.draft),
        canonical: Boolean(entry.data?.canonical)
      }
    }
  }

  return result
}

/**
 * Builds a full index of tag → per-locale slugs, derived from actual content entries.
 * Understands tag translations via an optional `tagMap` (e.g. `tools ↔ herramientas`).
 *
 * The result is indexed by BOTH the canonical key and every locale-specific slug,
 * so any lookup by the current page's tag slug resolves in O(1).
 *
 * @param allEntries - Pre-fetched collection entries
 * @param tagMap - Optional per-section translation map from domain/tags.ts
 * @returns Record mapping any tag slug (canonical or locale-specific) → { locale → localized slug }
 */
export function buildTagLocaleMap(
  allEntries: CollectionEntry<CollectionKey>[],
  tagMap?: TagMap
): Record<string, Partial<Record<UILanguages, string>>> {
  // Build canonical → { locale → slug } from actual content
  const canonicalMap: Record<string, Partial<Record<UILanguages, string>>> = {}
  for (const entry of allEntries) {
    if (entry.data?.draft) continue
    const [lang] = entry.id.split('/') as [UILanguages]
    const tags = entry.data?.tags ?? []
    for (const tag of tags) {
      const canonical = tagMap
        ? (Object.entries(tagMap).find(([, locales]) => locales[lang] === tag)?.[0] ?? tag)
        : tag
      canonicalMap[canonical] ??= {}
      canonicalMap[canonical][lang] = tag
    }
  }

  // Index by canonical key and all locale-slug aliases for O(1) lookup
  return Object.fromEntries(
    Object.entries(canonicalMap).flatMap(([canonical, localeData]) => [
      [canonical, localeData],
      ...Object.values(localeData)
        .filter(slug => slug !== canonical)
        .map(slug => [slug, localeData]),
    ])
  )
}
