import type { UILanguages } from '@i18n/ui'
import { getPostsByLocale, getUniqueTags } from '@utils/paths'
import { getSectionConfigByRoute, sectionsConfig } from '@config/sections'
import type { SectionType } from '@config/sections'

/**
 * Carga dinámicamente los posts y configuración de una sección
 * Centraliza la lógica de carga para evitar duplicación
 */
export async function loadSection(section: SectionType, locale: UILanguages) {
  const config = sectionsConfig[section]

  if (!config) {
    throw new Error(`Section config not found for ${section}`)
  }

  const posts = await getPostsByLocale(config.collection, locale)
  const tags = config.hasTags ? getUniqueTags(posts) : []

  return {
    config,
    posts,
    tags
  }
}

/**
 * Carga una sección basada en el parámetro de ruta (URL)
 * Útil para el routing dinámico en [section].astro
 */
export async function loadSectionByRoute(
  sectionSlug: string,
  locale: UILanguages
) {
  const config = getSectionConfigByRoute(sectionSlug, locale)

  if (!config) {
    return null
  }

  const posts = await getPostsByLocale(config.collection, locale)
  const tags = config.hasTags ? getUniqueTags(posts) : []

  return {
    config,
    posts,
    tags
  }
}
