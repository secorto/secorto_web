import type { UILanguages } from '@i18n/ui'
import { getPostsByLocale, getUniqueTags } from '@utils/paths'
import { getSectionConfigByRoute } from '@utils/sections'

/**
 * Carga una sección basada en el parámetro de ruta (URL)
 * Útil para el routing dinámico en [section].astro
 */
export async function loadSectionByRoute(
  sectionSlug: string,
  locale: UILanguages
) {
  const config = getSectionConfigByRoute(sectionSlug, locale)
  const posts = await getPostsByLocale(config.collection, locale)
  const tags = getUniqueTags(posts)
  return {
    config,
    posts,
    tags
  }
}
