import type { UILanguages } from '@i18n/ui'
import { getPostsByLocale, getUniqueTags, type CollectionWithTags } from '@utils/paths'
import { getSectionConfigByRoute } from '@config/sections'
import { getCollection } from 'astro:content'
import { languageKeys } from '@i18n/ui'

/**
 * Extrae el ID limpio de una entrada (sin prefijo de locale).
 * Soporta múltiples locales dinámicamente.
 */
function extractCleanId(entryId: string): string {
  return languageKeys.reduce((id, lang) => id.replace(new RegExp(`^${lang}/`), ''), entryId)
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

  let posts
  let tags: string[] = []

  if (config.hasTags) {
    posts = await getPostsByLocale(config.collection as CollectionWithTags, locale)
    tags = getUniqueTags(posts)
  } else {
    posts = await getPostsByLocale(config.collection, locale)
  }

  return {
    config,
    posts,
    tags
  }
}

/**
 * Carga una entrada individual basada en la ruta de sección, locale y id limpio
 * Retorna { config, entry } o null cuando no se encuentra
 */
export async function loadEntryByRoute(
  sectionSlug: string,
  locale: UILanguages,
  id: string
) {
  const config = getSectionConfigByRoute(sectionSlug, locale)

  if (!config) return null

  const collectionName = config.collection
  const entries = await getCollection(collectionName)

  // Busca por slug si existe, o por cleanId del filename
  const entry = entries.find((e: any) => {
    const cleanId = extractCleanId(e.id)
    const entrySlug = e.data.slug || cleanId
    return e.id.startsWith(`${locale}/`) && entrySlug === id
  })

  if (!entry) return null

  return { config, entry }
}
