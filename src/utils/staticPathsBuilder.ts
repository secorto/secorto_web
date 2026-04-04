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
import type { AvailableLocales } from '@domain/translation'
import { type PostEntry, type ExperienceLikeEntry } from '@domain/post'
import { buildTagLocaleMap, getAvailableLocaleEntriesFromMap, buildLocaleEntryMap } from './translationHelpers'
import { buildDetailLinks } from '@i18n/languagePickerUtils'
import { availableLink, missingLink, buildLangPrefix } from '@domain/translationLink'
import type { TranslationLink } from '@domain/translationLink'
import { tagTranslations } from '@domain/tags'
import type { CollectionEntry, CollectionKey } from 'astro:content'
import { rootMap } from '@i18n/rootMap'

/** Minimal shape for the injected collection fetcher — easier to mock than the full generic overload. */
export type FetchCollection = (collection: CollectionKey) => Promise<CollectionEntry<CollectionKey>[]>

type SectionPathPostProps = {
  config: SectionConfig & { category: 'post' }
  posts: PostEntry<CollectionKey>[]
  tags: string[]
  links: TranslationLink[]
}

type SectionPathExperienceProps = {
  config: SectionConfig & { category: 'experience' }
  posts: ExperienceLikeEntry[]
  tags: string[]
  links: TranslationLink[]
}

export type SectionPathProps = SectionPathPostProps | SectionPathExperienceProps

export interface SectionPath {
  params: {
    locale: UILanguages
    section: string
  }
  props: SectionPathProps
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
    links: TranslationLink[]
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
    /** Mapa de locales disponibles para este entry, pre-calculado en build time. */
    availableLocales: AvailableLocales
    /** Pre-computado: array de TranslationLink (href, availability, locale) */
    links: TranslationLink[]
    config: SectionConfig
  }
}

/**
 * TagIndexPath: Para la página de índice de tags global.
 * Cachea todos los fetches (una sola vez) y lo pasa via props.
 */
export interface TagIndexPath {
  params: {
    locale: UILanguages
  }
  props: {
    allSectionEntries: Record<string, PostEntry<CollectionKey>[]>
    links: TranslationLink[]
  }
}


/**
 * Helper puro síncrono: dado un config de sección y sus entradas (ya procesadas con mapEntryId),
 * genera los SectionPath para todos los locales con el tipo de posts correcto según la categoría.
 * Separado de la orquestación async para ser directamente testeable sin mocks de fetch.
 */
export function buildLocalePathsForSection(
  config: SectionConfig,
  allEntries: PostEntry<CollectionKey>[]
): SectionPath[] {
  const links = languageKeys.map(l =>
    availableLink(`${buildLangPrefix(l)}/${config.routes[l]}`, l)
  )

  return languageKeys.map(locale => {
    const posts = filterByLocale(allEntries, locale)
    const tags = getUniqueTags(posts)

    if (config.category === 'post') {
      return {
        params: { locale, section: config.routes[locale] },
        props: { config: config as SectionConfig & { category: 'post' }, posts, tags, links }
      }
    }

    return {
      params: { locale, section: config.routes[locale] },
      // posts viene de FetchCollection (CollectionKey genérico); el cast es seguro porque
      // work/projects/community satisfacen ExperienceLikeEntry estructuralmente en runtime.
      props: { config: config as SectionConfig & { category: 'experience' }, posts: posts as ExperienceLikeEntry[], tags, links }
    }
  })
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
  const pathGroups = await Promise.all(
    sections.map(async config => {
      const allEntries = mapEntryId(await fetchCollection(config.name))
      return buildLocalePathsForSection(config, allEntries)
    })
  )
  return pathGroups.flat()
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
    const collectedEntries = await fetchCollection(config.name)
    const allEntries = mapEntryId(collectedEntries)
    const tagLocaleMap = buildTagLocaleMap(allEntries, tagTranslations)

    for (const locale of languageKeys) {
      const localePosts = filterByLocale(allEntries, locale)
      const tags = getUniqueTags(localePosts)

      for (const tag of tags) {
        const links = languageKeys.map(l => {
          const tagSlug = tagLocaleMap[tag]?.[l]
          return tagSlug
            ? availableLink(`${buildLangPrefix(l)}/${config.routes[l]}/tags/${tagSlug}`, l)
            : missingLink(l)
        })
        paths.push({
          params: { locale, section: config.routes[locale], tag },
          props: { tag, allEntries, config, tagLocaleMap, links }
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
    const allEntries = mapEntryId(await fetchCollection(config.name))

    const localeEntryMapByPostId = buildLocaleEntryMap(allEntries)

    for (const entry of allEntries) {
      const locale = entry.locale
      const localeEntryMap = getAvailableLocaleEntriesFromMap(localeEntryMapByPostId, entry.postId)
      const links = buildDetailLinks(config.routes[locale], localeEntryMap)

      allPaths.push({
        params: { locale, section: config.routes[locale], id: entry.cleanId },
        props: { entry, availableLocales: localeEntryMap, links, config }
      })
    }
  }

  return allPaths
}

/**
 * Core: Construye rutas del índice de tags global (sin acoplamiento).
 * Cachea las colecciones UNA sola vez en getStaticPaths y las comparte con todas las rutas locales.
 * Esto evita duplicar fetches (sections × locales = N fetches vs 1 cacheo).
 *
 * @param sections - Secciones a procesar (inyectadas)
 * @param fetchCollection - Función para obtener colecciones
 * @returns Array de paths para getStaticPaths (uno por locale, con datos cacheados)
 */
export async function buildTagIndexPathsCore(
  sections: SectionConfig[],
  fetchCollection: FetchCollection
): Promise<TagIndexPath[]> {
  const allSectionEntries: Record<string, PostEntry<CollectionKey>[]> = {}

  for (const config of sections) {
    const entries = await fetchCollection(config.name)
    allSectionEntries[config.name] = mapEntryId(entries)
  }

  const globalTagsLinks = languageKeys.map(l =>
    availableLink(`${buildLangPrefix(l)}/${rootMap['tags'][l]}`, l)
  )
  return languageKeys.map((locale) => {
    return {
      params: { locale },
      props: { allSectionEntries, links: globalTagsLinks }
    }
  })
}
