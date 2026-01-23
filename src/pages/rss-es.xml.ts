import rss from '@astrojs/rss'
import { useTranslations } from '@i18n/utils'
import type { APIContext } from 'astro'
import type { UILanguages } from '@i18n/ui'
import { buildRSSItems } from '@utils/rssBuilder'

/**
 * RSS feed en español.
 * Accesible en /rss-es.xml
 */
export async function GET(context: APIContext) {
  const locale: UILanguages = 'es'
  const t = useTranslations(locale)

  const items = await buildRSSItems('blog', locale)

  return rss({
    title: t('nav.blog'),
    description: t('site.description') || 'Blog',
    site: context.site || 'https://secorto.com',
    items: items.map((item) => ({
      title: item.title,
      description: item.description,
      link: item.link,
      pubDate: item.pubDate
    })),
    customData: `<language>es-co</language>`,
  })
}
