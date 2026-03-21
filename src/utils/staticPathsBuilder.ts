/**
 * Core business logic for building static paths.
 *
 * This module contains pure functions without global coupling.
 * All dependencies (sections, collection fetcher) are explicitly injected.
 *
 * Architecture:
 * - staticPathsBuilder.ts (this file): Core functions - pure and testable
 * - staticPathsBuilder.adapters.ts: Adapters - inject sectionsConfig and provide prod defaults
 *
 * Tests import from this file (Core).
 * Production code (Astro pages) imports from adapters.
 */

import { languageKeys, type UILanguages } from '@i18n/ui'
import { type SectionConfig } from '@domain/section'
import { filterByLocale, getUniqueTags, mapEntryId } from './paths'
import { type PostEntry } from '@domain/post'
import { buildTagLocaleMap } from './translationHelpers'
import { tagTranslations } from '@domain/tags'
import type { CollectionEntry, CollectionKey } from 'astro:content'

/** Minimal shape for the injected collection fetcher — easier to mock than the full generic overload. */
export type FetchCollection = (collection: CollectionKey) => Promise<CollectionEntry<CollectionKey>[]>

export interface SectionPath {
  params: {
    locale: UILanguages
    section: string
  }
  props: {
    config: SectionConfig
    posts: PostEntry<CollectionKey>[]
    tags: string[]
  }
}

export interface TagPath {
  params: {
    locale: UILanguages
    section: string
    tag: string
  }
  props: {
    tag: string
    allEntries: PostEntry<CollectionKey>[]
    config: SectionConfig
    tagLocaleMap: Record<string, Partial<Record<UILanguages, string>>>
  }
}

export interface DetailPath {
  params: {
    locale: UILanguages
    section: string
    id: string
  }
  props: {
    entry: PostEntry<CollectionKey>
    allEntries: PostEntry<CollectionKey>[]
    config: SectionConfig
  }
}


/**
 * Core: Construye rutas de índices de secciones sin acoplamiento.
 * Recibe las secciones como parámetro explícito (array).
 * @param sections - Secciones a procesar (inyectadas)
 * @param fetchCollection - Función para obtener colecciones
 * @returns Array de paths para getStaticPaths
 */
export async function buildSectionIndexPathsCore(
  sections: SectionConfig[],
  fetchCollection: FetchCollection
): Promise<SectionPath[]> {
  const paths: SectionPath[] = []

  for (const config of sections) {
    const allEntries = mapEntryId(await fetchCollection(config.collection))

    for (const locale of languageKeys) {
      const posts = filterByLocale(allEntries, locale)
      const tags = getUniqueTags(posts)

      paths.push({
        params: { locale, section: config.routes[locale] },
        props: { config, posts, tags }
      })
    }
  }

  return paths
}

/**
 * Core: Construye rutas de páginas de tags sin acoplamiento.
 * Recibe las secciones como parámetro explícito (array).
 * @param sections - Secciones a procesar (inyectadas)
 * @param fetchCollection - Función para obtener colecciones
 * @returns Array de paths para getStaticPaths
 */
export async function buildTagPathsCore(
  sections: SectionConfig[],
  fetchCollection: FetchCollection
): Promise<TagPath[]> {
  const paths: TagPath[] = []

  for (const config of sections) {
    const collectedEntries = await fetchCollection(config.collection)
    const allEntries = mapEntryId(collectedEntries)
    const tagLocaleMap = buildTagLocaleMap(allEntries, tagTranslations)

    for (const locale of languageKeys) {
      const localePosts = filterByLocale(allEntries, locale)
      const tags = getUniqueTags(localePosts)

      for (const tag of tags) {
        paths.push({
          params: { locale, section: config.routes[locale], tag },
          props: { tag, allEntries, config, tagLocaleMap }
        })
      }
    }
  }

  return paths
}

/**
 * Core: Construye rutas de páginas de detalle sin acoplamiento.
 * Recibe las secciones como parámetro explícito (array).
 * @param sections - Secciones a procesar (inyectadas)
 * @param fetchCollection - Función para obtener colecciones
 * @returns Array de paths para getStaticPaths
 */
export async function buildAllDetailPathsCore(
  sections: SectionConfig[],
  fetchCollection: FetchCollection
): Promise<DetailPath[]> {
  const allPaths: DetailPath[] = []

  for (const config of sections) {
    const allEntries = mapEntryId(await fetchCollection(config.collection))
    for (const locale of languageKeys) {
      const sectionRoute = config.routes[locale]
      for (const entry of allEntries.filter(e => e.id.startsWith(`${locale}/`))) {
        allPaths.push({
          params: { locale, section: sectionRoute, id: entry.cleanId },
          props: { entry, allEntries, config }
        })
      }
    }
  }

  return allPaths
}
