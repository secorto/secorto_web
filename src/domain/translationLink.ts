import type { UILanguages } from '@i18n/ui'

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
 * Construye un TranslationLink disponible pero marcado como borrador (draft).
 * El link es navegable (isAvailable true) pero la UI puede indicar que el contenido no es definitivo.
 */
export function draftLink(href: string, lang: UILanguages): TranslationLink {
  return { href, isAvailable: true, disabledReason: 'draft', locale: lang }
}
