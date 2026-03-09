import type { UILanguages } from '@i18n/ui'
import type { SectionType } from './section'

/**
 * canonical → { locale → url-slug }
 * The canonical key is arbitrary (we use English by convention).
 */
export type TagMap = Record<string, Partial<Record<UILanguages, string>>>

/**
 * Per-section tag translation map.
 * Only declare tags whose slug differs across locales — tags that are the same
 * in every locale (e.g. 'python', 'linux') don't need an entry here.
 */
export const tagTranslations: Partial<Record<SectionType, TagMap>> = {
  blog: {
    tools: { en: 'tools', es: 'herramientas' },
    games: { en: 'games', es: 'juegos' },
  },
  talk: {},
}
