import type { UILanguages } from '@i18n/ui'
import { sectionsConfig } from '@config/sections'
import { getPostsByLocale } from './paths'

interface RSSItem {
  title: string
  description: string
  link: string
  pubDate: Date
}

/**
 * Construye items RSS para una colección específica y locale.
 * @param collection - Nombre de la colección (ej: 'blog', 'talk')
 * @param locale - Idioma
 * @returns Array de items RSS
 */
export async function buildRSSItems(collection: string, locale: UILanguages): Promise<RSSItem[]> {
  const posts = await getPostsByLocale(collection as never, locale)

  return posts.map((post: any) => {
    const data = post.data as any
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

/**
 * Construye URL RSS para un locale específico.
 * @param locale - Idioma
 * @returns URL del feed RSS
 */
export function buildRSSUrl(locale: UILanguages): string {
  return locale === 'en' ? '/rss.xml' : `/rss-${locale}.xml`
}
