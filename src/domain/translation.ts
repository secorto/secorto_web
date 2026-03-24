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
 * Reglas (resumen):
 * - `available` es un array de entradas con la forma { lang, slug, draft?, canonical? }.
 * - Si `available` está vacío, devuelve `defaultLocale`.
 * - Si más de una entrada tiene `canonical: true`, lanza un `Error` por ambigüedad.
 * - Si exactamente una entrada tiene `canonical: true`, retorna su `lang`.
 * - Si ninguna tiene `canonical: true` y `defaultLocale` está presente en `available`, retorna `defaultLocale`.
 * - Si ninguna de las condiciones anteriores aplica, retorna el primer `lang`
 *   disponible siguiendo el orden preferido en `languageKeys`.
 * - Como último recurso, retorna `available[0].lang`.
 *
 * Nota: la agregación y validación de duplicados (p.ej. múltiples entradas
 * para el mismo `canonicalId`+`lang`) debe hacerse en una fase separada;
 * esta función se centra únicamente en resolver el locale canónico dada la
 * lista de locales disponibles.
 */
export function resolveDefaultLocale(
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
