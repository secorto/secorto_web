import { getCollection } from 'astro:content'
import { languageKeys, type UILanguages } from '@i18n/ui'
import { sectionsConfig, type SectionConfig } from '@domain/section'
import { filterByLocale, getUniqueTags, mapEntryId } from './paths'
import { isCollectionWithTags, type CollectionWithTags, type PostEntry } from '@domain/post'
import { buildTagLocaleMap } from './translationHelpers'
import { tagTranslations } from '@domain/tags'
import type { SectionType } from '@domain/section'
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
    allEntries: PostEntry<CollectionWithTags>[]
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
 * Helper: Retorna iterador de todas las secciones.
 */
function* iterateSections(): Generator<SectionConfig> {
  for (const [_, config] of Object.entries(sectionsConfig)) {
    yield config
  }
}

/**
 * Construye todas las rutas estáticas para índices de secciones.
 * Genera una ruta por sección × idioma. Incluye posts y tags en props
 * para evitar llamadas redundantes a getCollection en el render.
 * @param fetchCollection - Inyectable para testing (default: getCollection de Astro)
 * @returns Array de paths para getStaticPaths
 */
export async function buildSectionIndexPaths(
  fetchCollection: FetchCollection = getCollection
): Promise<SectionPath[]> {
  const paths: SectionPath[] = []

  for (const config of iterateSections()) {
    const allEntries = mapEntryId(await fetchCollection(config.collection))

    for (const locale of languageKeys) {
      const posts = filterByLocale(allEntries, locale)
      const tags = isCollectionWithTags(config.collection)
        ? getUniqueTags(posts as PostEntry<CollectionWithTags>[])
        : []

      paths.push({
        params: { locale, section: config.routes[locale] },
        props: { config, posts, tags }
      })
    }
  }

  return paths
}

/**
 * Construye todas las rutas estáticas para páginas de tags.
 * Solo genera rutas para secciones que tienen tags habilitados.
 * Incluye allEntries y config en props para evitar llamadas redundantes en el render.
 * @param fetchCollection - Inyectable para testing (default: getCollection de Astro)
 * @returns Array de paths para getStaticPaths
 */
export async function buildTagPaths(
  fetchCollection: FetchCollection = getCollection
): Promise<TagPath[]> {
  const paths: TagPath[] = []

  for (const [sectionType, config] of Object.entries(sectionsConfig) as [SectionType, SectionConfig][]) {
    if (!isCollectionWithTags(config.collection)) continue

    // isCollectionWithTags guard above narrows config.collection to CollectionWithTags
    const collectedEntries = await fetchCollection(config.collection as CollectionWithTags)
    const allEntries = mapEntryId(collectedEntries) as PostEntry<CollectionWithTags>[]
    const tagLocaleMap = buildTagLocaleMap(allEntries, tagTranslations[sectionType])

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
 * Construye todas las rutas estáticas para páginas de detalle.
 * Genera una ruta por entrada × idioma en todas las secciones.
 * Incluye entry, allEntries y config en props para evitar llamadas redundantes en el render.
 * @param fetchCollection - Función para obtener colecciones (inyectada para testing)
 * @returns Array de paths para getStaticPaths
 */
export async function buildAllDetailPaths(
  fetchCollection: FetchCollection
): Promise<DetailPath[]> {
  const allPaths: DetailPath[] = []

  for (const config of iterateSections()) {
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
