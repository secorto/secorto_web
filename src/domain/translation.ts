import { defaultLang, type UILanguages } from '@i18n/ui'

export type AvailableLocaleEntry = {
  /** Local slug para este entry en el locale (p.ej. 'mi-articulo') */
  slug: string
  /** Marca si la traducción está en estado draft (no pública) */
  draft?: boolean
  /** Indica si esta entrada es la versión canónica dentro de la serie */
  canonical?: boolean
}

export type AvailableLocales = Partial<Record<UILanguages, AvailableLocaleEntry>>

/**
 * Decide qué locale usar como canónico para una serie de entradas.
 *
 * Reglas implementadas:
 * - Solo se consideran las entradas no-draft (entry.draft !== true).
 * - Si no hay entradas no-draft, devuelve `undefined`.
 * - Si entre las no-draft existe una con `canonical: true`, devuelve ese locale.
 * - Si hay más de una entrada no-draft con `canonical: true`, se deja la
 *   decisión al consumidor (no se lanza error aquí) y se siguen las reglas
 *   de preferencia descritas más abajo.
 * - Si no hay `canonical` explícito, se prefiere `defaultLocale` si está
 *   presente entre las no-draft.
 * - Si tampoco está `defaultLocale`, se devuelve el primer locale no-draft
 *   encontrado.
 *
 * Nota: la validación de duplicados por `(canonicalId, locale)` se realiza
 * en la fase de agregación (`buildLocaleEntryMap`) y seguirá lanzando si hay
 * entradas repetidas para el mismo locale.
 */
export function resolveSeriesCanonicalLocale(
  available: AvailableLocales,
  defaultLocale: UILanguages = defaultLang
): UILanguages | undefined {
  const nonDraftEntries = Object.entries(available)
    .filter(([, entry]) => Boolean(entry) && entry!.draft !== true)
    .map(([loc, entry]) => [loc as UILanguages, entry as NonNullable<AvailableLocales[keyof AvailableLocales]>] as const)

  if (nonDraftEntries.length === 0) return undefined

  const canonicalLocales = nonDraftEntries
    .filter(([, entry]) => Boolean(entry.canonical))
    .map(([loc]) => loc)

  if (canonicalLocales.length === 1) return canonicalLocales[0]

  const hasDefault = nonDraftEntries.some(([loc]) => loc === defaultLocale)
  if (hasDefault) return defaultLocale

  return nonDraftEntries[0][0]
}
