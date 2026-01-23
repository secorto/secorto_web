import { getSectionConfigByRoute, type SectionConfig } from '@config/sections'
import { getTagsPaths, getPostsByLocale } from './paths'
import type { UILanguages } from '@i18n/ui'

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
  posts: any[]
  tags: string[]
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
  const allPosts = await getPostsByLocale(config.collection, locale)
  
  // Filtrar por tag y extraer tags únicos
  const posts = allPosts.filter((post: any) => post.data.tags?.includes(tag))
  const tags = [...new Set(allPosts.flatMap((post: any) => post.data.tags ?? []))]

  return {
    config,
    locale,
    section,
    tag,
    posts,
    tags
  }
}
