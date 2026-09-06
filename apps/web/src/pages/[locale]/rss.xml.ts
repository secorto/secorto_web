import rss from '@astrojs/rss'
import { useTranslations } from '@i18n/utils'
import { languages, sections } from '@i18n/ui'
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

  const posts = (await getCollection('blog', availableAtLocale(locale)))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())

  const items = posts.map((post) => mapPostToRSSItem(post, 'blog', locale))

  return rss({
    title: sections['blog'][locale],
    description: t('site.description') || 'Blog',
    site: context.site || import.meta.env.SITE,
    items: items,
    customData: `<language>${LOCALE_COUNTRY[locale]}</language>`,
  })
}
