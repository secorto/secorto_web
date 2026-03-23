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
 * 1) La marca `canonical: true` en frontmatter se resuelve durante
 *    el paso de generación de rutas (`getStaticPaths`) y no se re-evalúa
 *    aquí (es demasiado costoso re-leer contenido por página).
 * 2) Si la serie ya tiene un locale preferido en tiempo de ejecución,
 *    se pasará por parámetros o se incluirá en los datos precomputados.
 * 3) Como fallback local sencillo, esta función prioriza el `defaultLocale`
 *    (por defecto `es`) y si no está disponible devuelve el primer locale
 *    disponible.
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
