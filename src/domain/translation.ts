import { type UILanguages } from '@i18n/ui'

export type AvailableLocales = Partial<Record<UILanguages, {
  /** Local slug para este entry en el locale (p.ej. 'mi-articulo') */
  slug: string
  /** Marca si la traducción está en estado draft (no pública) */
  draft?: boolean
  /** Indica si esta entrada es la versión canónica dentro de la serie */
  canonical?: boolean
}>>

/**
 * Decide qué locale usar como canónico para una serie de entradas.
 *
 * Comportamiento actual (implementación):
 * - `available` es un mapa `{ [lang]: { slug, draft?, canonical? } }`.
 * - Recorre las entradas y, si encuentra una con `canonical: true`, retorna
 *   inmediatamente ese `lang` (retorna la primera encontrada).
 * - Si no hay `canonical: true`, prioriza `defaultLocale` si está presente.
 * - Si tampoco está `defaultLocale`, devuelve el primer locale encontrado
 *   durante la iteración.
 * - No realiza validación exhaustiva de inconsistencias (p.ej. múltiples
 *   entradas por el mismo `canonicalId`+`lang`); esa validación se realiza
 *   en la fase de agregación/mapeo de entradas.
 */
export function resolveSeriesCanonicalLocale(
  available: AvailableLocales,
  defaultLocale: UILanguages = 'es'
): UILanguages {
  let firstLocale: UILanguages | undefined
  let hasDefault = false

  for (const [loc, entry] of Object.entries(available) as [UILanguages, AvailableLocales[keyof AvailableLocales]][]) {
    if (!firstLocale) firstLocale = loc
    if (loc === defaultLocale) hasDefault = true
    if (entry && entry.canonical) return loc
  }

  if (!hasDefault && firstLocale) return firstLocale
  return defaultLocale
}
