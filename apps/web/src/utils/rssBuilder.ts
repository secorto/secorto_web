import { type UILanguages } from '@i18n/ui'
import { sectionRoutes, type SectionType } from '@domain/section'

interface RSSItem {
  title: string
  description: string
  link: string
  pubDate: Date
}

interface RSSSourcePost {
  id: string
  data: {
    title: string
    excerpt?: string
    description?: string
    date: Date
  }
}

/**
 * Mapea un post fuente a un `RSSItem`
 */
export function mapPostToRSSItem(post: RSSSourcePost, section: SectionType, locale: UILanguages): RSSItem {
  const data = post.data

  return {
    title: data.title,
    description: data.excerpt || data.description || '',
    link: sectionRoutes.getEntryPathFromId(section, locale, post.id),
    pubDate: data.date
  }
}
