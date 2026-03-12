import type { UILanguages } from '@i18n/ui'

/**
 * canonical → { locale → url-slug }
 * The canonical key is arbitrary (we use English by convention).
 */
export type TagMap = Record<string, Partial<Record<UILanguages, string>>>

/**
 * Global tag translation map.
 * Only declare tags whose slug differs across locales — tags that are the same
 * in every locale (e.g. 'python', 'linux') don't need an entry here.
 */
export const tagTranslations: TagMap = {
  tools: { en: 'tools', es: 'herramientas' },
  games: { en: 'games', es: 'juegos' },
}

export function getCanonicalTag(tag: string, lang: UILanguages): string {
  const mappedTag = Object.entries(tagTranslations).find(([, locales]) => locales[lang] === tag)
  return mappedTag?.[0] ?? tag
}

export function getLocalizedTag(canonicalTag: string, lang: UILanguages): string {
  return tagTranslations[canonicalTag]?.[lang] ?? canonicalTag
}
