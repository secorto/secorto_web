import type { UILanguages } from '@i18n/ui'
import { getPostsByLocale } from './paths'
import { sectionRoutes, type SectionType } from '@domain/section'

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
export async function buildRSSItems(section: SectionType, locale: UILanguages): Promise<RSSItem[]> {
  const posts = await getPostsByLocale(section, locale) as RSSSourcePost[]

  return posts.map((post: RSSSourcePost) => mapPostToRSSItem(post, section, locale))
}

/**
 * Mapea un post fuente a un `RSSItem`
 */
export function mapPostToRSSItem(post: RSSSourcePost, section: SectionType, locale: UILanguages): RSSItem {
  const data = post.data
  const cleanId = post.cleanId

  return {
    title: data.title,
    description: data.excerpt || data.description || '',
    link: sectionRoutes.getEntryURL(section, locale, cleanId),
    pubDate: new Date(data.date || 0)
  }
}
