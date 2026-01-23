import rss from '@astrojs/rss'
import { useTranslations } from '@i18n/utils'
import { languageKeys, defaultLang } from '@i18n/ui'
import type { APIContext } from 'astro'
import type { UILanguages } from '@i18n/ui'
import { buildRSSItems } from '@utils/rssBuilder'

/**
 * RSS feed dinámico.
 * Por defecto genera el feed en el idioma default (en).
 * Los feeds en otros idiomas se acceden como /rss-{lang}.xml
 */
export async function GET(context: APIContext) {
  // Determinar el idioma del feed desde la URL
  // /rss.xml → idioma default (en)
  // /rss-es.xml → español
  const url = new URL(context.request.url)
  const pathname = url.pathname

  let feedLocale: UILanguages = defaultLang as UILanguages
  if (pathname.includes('rss-')) {
    const match = pathname.match(/rss-([a-z]{2})/)
    if (match && languageKeys.includes(match[1] as UILanguages)) {
      feedLocale = match[1] as UILanguages
    }
  }

  const t = useTranslations(feedLocale)

  // Construir items RSS del blog (es la colección que tiene más sentido para RSS)
  const items = await buildRSSItems('blog', feedLocale)

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
    customData: `<language>${feedLocale}-${feedLocale === 'en' ? 'us' : 'co'}</language>`,
  })
}
