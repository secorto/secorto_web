import type { UILanguages } from '@i18n/ui'
import { defaultLang } from '@i18n/ui'
import { showDefaultLang } from '@i18n/config'

export interface TranslationLink {
  /** URL destino del link (puede ser string vacío si no está disponible) */
  href: string
  /** Si la traducción/route está disponible para navegación */
  isAvailable: boolean
  /** Locale asociado a este link (clave de idioma) */
  locale: UILanguages
  /** Razón por la que no está disponible (cuando `isAvailable` es false) */
  disabledReason?: 'missing' | 'draft'
}

/**
 * Construye un TranslationLink disponible con href.
 */
export function availableLink(href: string, lang: UILanguages): TranslationLink {
  return { href, isAvailable: true, locale: lang }
}

/**
 * Construye un TranslationLink no disponible (missing).
 */
export function missingLink(lang: UILanguages): TranslationLink {
  return { href: '', isAvailable: false, disabledReason: 'missing', locale: lang }
}

/**
 * Calcula el prefijo de ruta localizado según el idioma.
 * Ejemplo: '/en' para inglés, '' para idioma por defecto (si showDefaultLang es false).
 */
export function buildLangPrefix(targetLang: UILanguages): string {
  return targetLang === defaultLang && !showDefaultLang ? "" : `/${targetLang}`
}
