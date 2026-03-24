import type { UILanguages } from '@i18n/ui'

export interface TranslationLink {
  /** URL destino del link (puede ser string vacío si no está disponible) */
  href: string
  /** Etiqueta legible para el selector de idioma (p.ej. 'Español') */
  label: string
  /** Si la traducción/route está disponible para navegación */
  isAvailable: boolean
  /** Locale asociado a este link (clave de idioma) */
  locale: UILanguages
  /** Razón por la que no está disponible (cuando `isAvailable` es false) */
  disabledReason?: 'missing' | 'draft'
}
