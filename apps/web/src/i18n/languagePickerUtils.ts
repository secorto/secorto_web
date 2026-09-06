import type { UILanguages } from './ui'
import { defaultLang } from './ui'
import type { TranslationLink } from '@domain/translationLink'
import { availableLink, missingLink } from '@domain/translationLink'
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
