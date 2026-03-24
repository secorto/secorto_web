import { defaultLang, type UILanguages } from '@i18n/ui'

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
 * - `available` es un mapa (`AvailableLocales`) indexado por `UILanguages`,
 *   donde cada valor tiene la forma `{ slug, draft?, canonical? }`.
 * - Si `available` está vacío, devuelve `defaultLocale`.
 * - Si alguna entrada tiene `canonical: true`, devuelve el primer locale
 *   con `canonical: true` encontrado al iterar `Object.entries(available)`
 *   (siguiendo el orden de inserción de las claves del objeto).
 * - Si ninguna entrada tiene `canonical: true` pero `defaultLocale` está
 *   presente en `available`, devuelve `defaultLocale`.
 * - Si `defaultLocale` no está presente en `available` pero existe al menos
 *   una entrada, devuelve el primer locale encontrado al iterar
 *   `Object.entries(available)` (primer locale definido en el mapa).
 * - Si `available` está vacío, devuelve `defaultLocale`.
 *
 * Nota: la agregación y validación de duplicados (p.ej. múltiples entradas
 * para el mismo `canonicalId`+`lang`) debe hacerse en una fase separada;
 * esta función se centra únicamente en resolver el locale canónico dada la
 * lista de locales disponibles.
 */
export function resolveDefaultLocale(
  available: AvailableLocales,
  defaultLocale: UILanguages = defaultLang
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
