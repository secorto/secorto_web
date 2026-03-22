import { rootMap } from '@i18n/rootMap'
import type { TranslationKey } from '@domain/section'

export type RouteKey = keyof typeof rootMap

/**
 * Única fuente de verdad: define qué rutas se muestran en navegación
 * y sus correspondientes claves de traducción.
 */
export const NAV_LINKS: Array<{
  routeKey: RouteKey
  translationKey: TranslationKey
}> = [
  { routeKey: 'about', translationKey: 'nav.about' },
  { routeKey: 'talk', translationKey: 'nav.talks' },
  { routeKey: 'blog', translationKey: 'nav.blog' },
  { routeKey: 'work', translationKey: 'nav.work' },
  { routeKey: 'community', translationKey: 'nav.community' },
  { routeKey: 'projects', translationKey: 'nav.projects' },
]
