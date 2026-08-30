import type { UILanguages } from './ui'
import { defaultLang } from './ui'
import type { TranslationLink } from '@domain/translationLink'
import { availableLink, missingLink, isAccessible } from '@domain/translationLink'
import { showDefaultLang } from '@i18n/config'
import { languages } from './ui'

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
  return languages.all.map(l => availableLink(`${buildLangPrefix(l)}/`, l))
}

/**
 * Build language links where every locale is intentionally unavailable.
 * Useful for routes that should show locked translation states (e.g. 404 pages).
 */
export function buildMissingLanguageLinks(): TranslationLink[] {
  return languages.all.map(l => missingLink(l))
}

/**
 * Construye `alternates` (lista de objetos `{ locale, url }`) a partir
 * de un array de `links`, filtrando los que no son accesibles.
 *
 * Nota: el filtro usa `isAccessible`, por lo que se incluyen tanto
 * `available` como `draft` por diseño — `alternates` representa enlaces
 * que pueden montarse en la UI aunque algunos sean borradores.
 */
export function buildAlternatesFromLinks<T extends TranslationLink>(links: T[]) {
  return links
    .filter(isAccessible)
    .map(l => ({ locale: l.locale, url: l.href }))
}
