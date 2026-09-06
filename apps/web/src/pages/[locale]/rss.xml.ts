import rss from '@astrojs/rss'
import { useTranslations } from '@i18n/utils'
import { languages } from '@i18n/ui'
import type { APIContext } from 'astro'
import type { UILanguages } from '@i18n/ui'
import { availableAtLocale, getStaticPathsLocales } from '@secorto/i18n'
import { getCollection } from 'astro:content'
import { mapPostToRSSItem } from '@utils/rssBuilder'

const LOCALE_COUNTRY: Record<UILanguages, string> = {
  es: 'es-co',
  en: 'en-us',
}

export function getStaticPaths() {
  return getStaticPathsLocales(languages)
}

export async function GET(context: APIContext) {
  const locale = languages.fromString(context.params.locale)
  const t = useTranslations(locale)

  const posts = await getCollection('blog', availableAtLocale(locale))

  const items = posts.map((post) => mapPostToRSSItem(post, 'blog', locale))

  return rss({
    title: t('nav.blog'),
    description: t('site.description') || 'Blog',
    site: context.site || import.meta.env.SITE,
    items: items,
    customData: `<language>${LOCALE_COUNTRY[locale]}</language>`,
  })
}
