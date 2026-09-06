import { languages, type UILanguages } from '@i18n/ui'
import { sectionRoutes, type SectionType } from '@domain/section'
import { extractCleanId } from '@secorto/i18n'

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
  const cleanId = extractCleanId(post.id, languages).id

  return {
    title: data.title,
    description: data.excerpt || data.description || '',
    link: sectionRoutes.getEntryURL(section, locale, cleanId),
    pubDate: data.date
  }
}
