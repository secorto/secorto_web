import type { SectionConfig } from '@domain/section'
import { getSectionConfigByRoute } from '@utils/sections'
import { getPostsByLocale, getUniqueTags } from '@utils/paths'
import type { EntryWithCleanId } from '@utils/paths'
import type { CollectionWithTags } from '@domain/post'
import type { UILanguages } from '@i18n/ui'
import type { CollectionEntry, CollectionKey } from 'astro:content'

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

export interface DetailPageContext<T extends { id: string } = CollectionEntry<CollectionKey>> {
  entry: T
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
