import rss from '@astrojs/rss'
import { useTranslations } from '@i18n/utils'
import { languageKeys } from '@i18n/ui'
import type { APIContext } from 'astro'
import type { UILanguages } from '@i18n/ui'
import { buildRSSItems } from '@utils/rssBuilder'

const LOCALE_COUNTRY: Record<UILanguages, string> = {
  es: 'es-co',
  en: 'en-us',
}

export function getStaticPaths() {
  return languageKeys.map((locale) => ({ params: { locale } }))
}

export async function GET(context: APIContext) {
  const locale = context.params.locale as UILanguages
  const t = useTranslations(locale)

  const items = await buildRSSItems('blog', locale)

  return rss({
    title: t('nav.blog'),
    description: t('site.description') || 'Blog',
    site: context.site || import.meta.env.SITE,
    items: items.map((item) => ({
      title: item.title,
      description: item.description,
      link: item.link,
      pubDate: item.pubDate,
    })),
    customData: `<language>${LOCALE_COUNTRY[locale]}</language>`,
  })
}
