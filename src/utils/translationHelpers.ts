/**
 * Translation utilities for determining locale availability.
 *
 * All functions are pure and synchronous — callers must fetch collection entries with
 * `getCollection` before calling these helpers. This avoids redundant `getCollection`
 * calls when the caller already has entries at hand.
 */
import type { CollectionKey } from 'astro:content'
import type { UILanguages } from '@i18n/ui'
import type { AvailableLocales } from '@domain/translation'
import type { TagMap } from '@domain/tags'
import type { PostEntry } from '@domain/post'

/**
 * Lookup helper: devuelve `AvailableLocales` desde un mapa precomputado.
 * Devuelve un objeto vacío si no existe la clave para mantener compatibilidad.
 */
export function getAvailableLocaleEntriesFromMap(
  localeEntryMap: Record<string, AvailableLocales>,
  postId: string
): AvailableLocales {
  return localeEntryMap[postId] ?? {}
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
  allEntries: PostEntry<CollectionKey>[],
  tagMap?: TagMap
): Record<string, Partial<Record<UILanguages, string>>> {
  // Build canonical → { locale → slug } from actual content
  const canonicalMap: Record<string, Partial<Record<UILanguages, string>>> = {}
  for (const entry of allEntries) {
    if (entry.data?.draft) continue
    if (!entry.data.tags?.length) continue
    const tags = entry.data.tags
    for (const tag of tags) {
      const canonical = tagMap
        ? (Object.entries(tagMap).find(([, locales]) => locales[entry.locale] === tag)?.[0] ?? tag)
        : tag
      canonicalMap[canonical] ??= {}
      canonicalMap[canonical][entry.locale] = tag
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

/**
 * Construye y devuelve un mapa `postId` -> `AvailableLocales`.
 *
 * Esto permite evitar parseos redundantes de `entry.id` cuando el caller
 * necesita el conjunto de locales disponibles por `postId`.
 */
export function buildLocaleEntryMap<C extends CollectionKey = CollectionKey>(
  allEntries: PostEntry<C>[]
): Record<string, AvailableLocales> {
  const localeEntryMap: Record<string, AvailableLocales> = {}

  // Single-pass build: O(N) over entries. Throws on duplicate (canonicalId, locale) pairs to fail fast on inconsistent content.
  for (const e of allEntries) {
    // Inicializa perezosamente el bucket para este `postId` usando `??=`.
    const bucket = localeEntryMap[e.postId] ??= {}
    const existing = bucket[e.locale as keyof AvailableLocales] as { slug?: string } | undefined
    if (existing) {
      throw new Error(
        `Duplicate entry for postId "${e.postId}" and locale "${e.locale}" - existing slug "${existing.slug}" vs "${e.cleanId}" (entry.id: ${e.id})`
      )
    }

    bucket[e.locale as keyof AvailableLocales] = {
      slug: e.cleanId,
      draft: Boolean(e.data?.draft),
      canonical: Boolean(e.data?.canonical)
    }
  }

  return localeEntryMap
}
