import { rootMap } from '@i18n/rootMap'
import { ui } from '@i18n/ui'

// Extraer las claves que existen en rootMap
export type RouteKey = keyof typeof rootMap

// Extraer las claves de traducción nav.* que existen en ui.en
type UIKeys = keyof typeof ui.en
export type TranslationKey = UIKeys

// Única fuente de verdad: define qué rutas se muestran en navegación
// y sus correspondientes claves de traducción
export const NAV_LINKS: Array<{
  routeKey: RouteKey
  translationKey: TranslationKey
}> = [
  { routeKey: 'about', translationKey: 'nav.about' },
  { routeKey: 'talk', translationKey: 'nav.talks' },
  { routeKey: 'blog', translationKey: 'nav.blog' },
  { routeKey: 'work', translationKey: 'nav.work' },
  { routeKey: 'community', translationKey: 'nav.community' },
  { routeKey: 'project', translationKey: 'nav.projects' },
]
