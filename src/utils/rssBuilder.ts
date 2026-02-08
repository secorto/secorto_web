import type { UILanguages } from '@i18n/ui'
import { sectionsConfig } from '@config/sections'
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
export async function buildRSSItems(collection: string, locale: UILanguages): Promise<RSSItem[]> {
  const posts = await getPostsByLocale(collection as never, locale) as RSSSourcePost[]

  return posts.map((post: RSSSourcePost) => {
    const data = post.data
    const cleanId = post.cleanId

    // Buscar la sección que contiene esta colección
    let sectionRoute = ''
    for (const [_, config] of Object.entries(sectionsConfig)) {
      if (config.collection === collection) {
        sectionRoute = config.routes[locale]
        break
      }
    }

    return {
      title: data.title,
      description: data.excerpt || data.description || '',
      link: `/${locale}/${sectionRoute}/${cleanId}`,
      pubDate: new Date(data.date || 0)
    }
  })
}
