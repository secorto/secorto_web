import type { UILanguages } from '@i18n/ui'
import { getPostsByLocale, getUniqueTags, type CollectionWithTags, type EntryWithCleanId } from '@utils/paths'
import { getSectionConfigByRoute } from '@config/sections'
import { getCollection } from 'astro:content'
import { extractCleanId } from '@utils/ids'

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
  const tags: string[] = config.hasTags ? getUniqueTags(posts as EntryWithCleanId<CollectionWithTags>[]) : []
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
  const collectionName = config.collection
  const entries = await getCollection(collectionName)

  // Busca por slug si existe, o por cleanId del filename
  const entry = entries.find((e: {id: string, data: {slug?: string}}) => {
    const cleanId = extractCleanId(e.id)
    const entrySlug = e.data.slug || cleanId
    return e.id.startsWith(`${locale}/`) && entrySlug === id
  })
  if (!entry) {
    throw new Error(`Entry not found for ${sectionSlug}/${id} (${locale})`)
  }

  return { config, entry }
}
