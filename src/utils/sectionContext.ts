import { getSectionConfigByRoute, sectionsConfig, type SectionConfig } from '@config/sections'
import { getPostsByLocale } from './paths'
import type { EntryWithCleanId, CollectionWithTags } from './paths'
import type { UILanguages } from '@i18n/ui'
import { getCollection, type CollectionEntry } from 'astro:content'
import { languageKeys } from '@i18n/ui'
import { extractCleanId } from './ids'

export interface SectionContext {
  config: SectionConfig
  locale: UILanguages
  section: string
}

export interface TagsPageContext {
  config: SectionConfig
  locale: UILanguages
  section: string
  tag: string
  posts: EntryWithCleanId<CollectionWithTags>[]
  tags: string[]
}

export interface DetailPageContext {
  entry: CollectionEntry<keyof import('astro:content').DataEntryMap> | { id: string; data: Record<string, unknown> }
  config: SectionConfig
  locale: UILanguages
  cleanId: string
  isUntranslated: boolean
  translationOriginLocale: UILanguages | null
}

/**
 * Construye el contexto de una página de sección (índice).
 * Valida que la sección exista en la configuración.
 * @throws Response 404 si la sección no existe
 * @returns Contexto con configuración validada
 */
export function buildSectionContext(section: string, locale: UILanguages): SectionContext {
  const config = getSectionConfigByRoute(section, locale)

  if (!config) {
    throw new Response('Not found', { status: 404 })
  }

  return {
    config,
    locale,
    section
  }
}

/**
 * Construye el contexto de una página de tags.
 * Carga posts desde la colección y filtra por tag.
 * @param section - Slug de la sección
 * @param locale - Idioma actual
 * @param tag - Tag actual
 * @returns Contexto con posts filtrados por tag
 * @throws Response 404 si la sección no existe
 */
export async function buildTagsPageContext(
  section: string,
  locale: UILanguages,
  tag: string
): Promise<TagsPageContext> {
  const config = getSectionConfigByRoute(section, locale)

  if (!config) {
    throw new Response('Not found', { status: 404 })
  }

  // Cargar todos los posts de la colección para este locale
  const allPosts = (await getPostsByLocale(config.collection as CollectionWithTags, locale))

  // Filtrar por tag y extraer tags únicos
  const posts = allPosts.filter((post) => post.data.tags?.includes(tag))
  const tags = [...new Set(allPosts.flatMap((post) => post.data.tags ?? []))]

  return {
    config,
    locale,
    section,
    tag,
    posts,
    tags
  }
}

/**
 * Obtiene la configuración de sección a partir de un slug de ruta.
 * Busca en todas las secciones qué configuración corresponde a este slug.
 * @param section - Slug de la sección (ej: 'blog', 'talk')
 * @returns Configuración o null si no existe
 */
function getSectionConfigByRouteSlug(
  section: string
): { config: SectionConfig; locale: UILanguages } | null {
  for (const [_, cfg] of Object.entries(sectionsConfig)) {
    for (const locale of languageKeys) {
      if (cfg.routes[locale as UILanguages] === section) {
        return { config: cfg, locale: locale as UILanguages }
      }
    }
  }

  return null
}

/**
 * Construye el contexto de una página de detalle (post/charla/proyecto/etc).
 * Intenta cargar la entrada en el locale actual, con fallback a otros locales.
 * @param section - Slug de la sección (ej: 'blog')
 * @param locale - Idioma solicitado
 * @param id - ID/slug del contenido
 * @param loadEntryByRoute - Función para cargar entrada
 * @returns Contexto con entrada o null si no existe
 */
export async function buildDetailPageContext(
  section: string,
  locale: UILanguages,
  id: string,
  loadEntryByRoute: (
    section: string,
    locale: UILanguages,
    id: string
  ) => Promise<{ entry: CollectionEntry<keyof import('astro:content').DataEntryMap> | { id: string; data: Record<string, unknown> }; config: SectionConfig } | null>
): Promise<DetailPageContext | null> {
  // Intentar cargar en el locale solicitado
  const loaded = await loadEntryByRoute(section, locale, id)

  if (loaded) {
    return {
      entry: loaded.entry,
      config: loaded.config,
      locale,
      cleanId: extractCleanId(loaded.entry.id),
      isUntranslated: false,
      translationOriginLocale: null
    }
  }

  // Fallback: buscar la entrada en otros locales
  const sectionInfo = getSectionConfigByRouteSlug(section)

  if (!sectionInfo) {
    return null
  }

  const { config } = sectionInfo
  const allEntries = await getCollection(config.collection)

  for (const searchLocale of languageKeys) {
    if (searchLocale === locale) continue

    const entry = allEntries.find((e) => {
      const cleanId = extractCleanId(e.id)
      const slug = (e.data as { slug?: string }).slug || cleanId
      return e.id.startsWith(`${searchLocale}/`) && slug === id
    })

    if (entry) {
      return {
        entry,
        config,
        locale: searchLocale as UILanguages,
        cleanId: extractCleanId(entry.id),
        isUntranslated: true,
        translationOriginLocale: searchLocale as UILanguages
      }
    }
  }

  return null
}
