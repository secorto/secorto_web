import type { UILanguages } from '@i18n/ui'
import type { CollectionKey } from 'astro:content'
import { getSectionConfigByCollection } from '@config/sections'
import { getPostsByLocale } from './paths'

interface RSSItem {
  title: string
  description: string
  link: string
  pubDate: Date
}

interface RSSSourcePost {
  data: {
    title: string
    excerpt?: string
    description?: string
    date?: string
  }
  cleanId: string
}

/**
 * Construye items RSS para una colección específica y locale.
 * @param collection - Nombre de la colección (ej: 'blog', 'talk')
 * @param locale - Idioma
 * @returns Array de items RSS
 */
export async function buildRSSItems(collection: CollectionKey, locale: UILanguages): Promise<RSSItem[]> {
  const posts = await getPostsByLocale(collection, locale) as RSSSourcePost[]

  const sectionConfig = getSectionConfigByCollection(collection)
  const sectionRoute = sectionConfig?.routes[locale] || ''

  return posts.map((post: RSSSourcePost) => mapPostToRSSItem(post, sectionRoute, locale))
}

/**
 * Mapea un post fuente a un `RSSItem`
 */
/**
 * Mapea un post fuente a un `RSSItem`
 * @internal exportado para pruebas
 */
export function mapPostToRSSItem(post: RSSSourcePost, sectionRoute: string, locale: UILanguages): RSSItem {
  const data = post.data
  const cleanId = post.cleanId

  return {
    title: data.title,
    description: data.excerpt || data.description || '',
    link: `/${locale}/${sectionRoute}/${cleanId}`,
    pubDate: new Date(data.date || 0)
  }
}
