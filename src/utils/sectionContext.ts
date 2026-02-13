import { getSectionConfigByRoute, type SectionConfig } from '@config/sections'
import { getPostsByLocale, getUniqueTags } from '@utils/paths'
import type { EntryWithCleanId, CollectionWithTags } from '@utils/paths'
import type { UILanguages } from '@i18n/ui'
import type { CollectionEntry } from 'astro:content'
import { extractCleanId } from "@utils/ids"

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
}

/**
 * Construye el contexto de una página de sección (índice).
 * Valida que la sección exista en la configuración.
 * @returns Contexto con configuración validada
 */
export function buildSectionContext(section: string, locale: UILanguages): SectionContext {
  const config = getSectionConfigByRoute(section, locale)

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
 */
export async function buildTagsPageContext(
  section: string,
  locale: UILanguages,
  tag: string
): Promise<TagsPageContext> {
  const config = getSectionConfigByRoute(section, locale)

  // Cargar todos los posts de la colección para este locale
  const allPosts = (await getPostsByLocale(config.collection as CollectionWithTags, locale))

  // Filtrar por tag y extraer tags únicos
  const posts = allPosts.filter((post) => post.data.tags?.includes(tag))
  const tags = getUniqueTags(allPosts)

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
 * Construye el contexto de una página de detalle (post/charla/proyecto/etc).
 * Intenta cargar la entrada en el locale actual.
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
  ) => Promise<{ entry: CollectionEntry<keyof import('astro:content').DataEntryMap>; config: SectionConfig } | null>
): Promise<DetailPageContext | null> {
  const loaded = await loadEntryByRoute(section, locale, id)

  if (!loaded) {
    return null
  }

  return {
    entry: loaded.entry,
    config: loaded.config,
    locale,
    cleanId: extractCleanId(loaded.entry.id)
  }
}
