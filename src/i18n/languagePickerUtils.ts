import type { UILanguages } from './ui'
import { defaultLang } from './ui'
import type { TranslationLink } from '@domain/translationLink'
import { availableLink, missingLink } from '@domain/translationLink'
import { languageKeys } from './ui'
import { findSectionMap } from './rootMap'
import type { AvailableLocales } from '@domain/translation'
import { showDefaultLang } from '@i18n/config'

/**
 * Calcula el prefijo de ruta localizado según el idioma.
 * Si `showDefaultLang` es false y el idioma es el por defecto, devuelve string vacío.
 * En caso contrario, devuelve `/{lang}`.
 */
export function buildLangPrefix(targetLang: UILanguages): string {
  return targetLang === defaultLang && !showDefaultLang ? '' : `/${targetLang}`
}

/**
 * Construye links de language picker para la página de inicio (todos los idiomas).
 * @returns Array de links disponibles para cada idioma apuntando a la raíz del sitio
 */
export function buildHomeLinks(): TranslationLink[] {
  return languageKeys.map(l => availableLink(`${buildLangPrefix(l)}/`, l))
}

/**
 * Construye un link de detalle usando directamente la sección localizada (sin pasar por el mapa canonical→localized).
 * Útil cuando el caller ya conoce la ruta localizada para cada idioma (por ejemplo desde `config.routes`).
 */
export function buildDetailLink(
  targetLang: UILanguages,
  localizedSection: string,
  availableLocales: AvailableLocales
): TranslationLink {
  const entry = availableLocales[targetLang]

  if (!entry) return missingLink(targetLang)

  const link = availableLink(`${buildLangPrefix(targetLang)}/${localizedSection}/${entry.slug}`, targetLang)
  if (entry.draft) return { ...link, disabledReason: 'draft' }
  return link
}

/**
 * Construye links de detalle para todos los idiomas.
 * Útil para obtener los links de traducción disponibles de un post/entry específico.
 */
export function buildDetailLinks(
  localizedSection: string,
  availableLocales: AvailableLocales
): TranslationLink[] {
  return languageKeys.map(l => buildDetailLink(l, localizedSection, availableLocales))
}

/**
 * Build language links where every locale is intentionally unavailable.
 * Useful for routes that should show locked translation states (e.g. 404 pages).
 */
export function buildMissingLanguageLinks(): TranslationLink[] {
  return languageKeys.map(l => missingLink(l))
}

/**
 * Builds links for all languages from a URL.
 * Hoists URL parsing and rootMap scan outside the per-language loop.
 */
export function buildStaticPageLinks(url: URL): TranslationLink[] {
  const [, maybeLocale, rawSegment] = url.pathname.split('/')
  if (!(languageKeys as string[]).includes(maybeLocale)) return buildMissingLanguageLinks()

  const currentLocale = maybeLocale as UILanguages
  const sectionMap = findSectionMap(rawSegment, currentLocale)

  return languageKeys.map(targetLang => {
    const localized = sectionMap?.[targetLang]
    if (localized) return availableLink(`${buildLangPrefix(targetLang)}/${localized}`, targetLang)
    if (targetLang === currentLocale) return availableLink(`${buildLangPrefix(targetLang)}/${rawSegment}`, targetLang)
    return missingLink(targetLang)
  })
}

/**
 * Construye `alternates` (lista de objetos `{ locale, url }`) a partir
 * de un array de `links`, filtrando los que no están disponibles.
 */
export function buildAlternatesFromLinks<T extends TranslationLink>(links: T[]) {
  return links
    .filter(l => Boolean(l.isAvailable) && Boolean(l.href))
    .map(l => ({ locale: l.locale, url: l.href }))
}
