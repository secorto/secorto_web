import { languageKeys, type UILanguages } from '@i18n/ui'

/**
 * Extrae el `locale` (si existe como prefijo) y el `cleanId` sin el prefijo.
 * Ej: 'es/mi-post' -> { locale: 'es', id: 'mi-post' }
 */
export function extractCleanId(entryId: string): { locale?: UILanguages; id: string } {
  if (!entryId) throw new Error('entryId cannot be empty')

  const firstSlash = entryId.indexOf('/')
  if (firstSlash > 0) {
    const possibleLang = entryId.slice(0, firstSlash)
    if (languageKeys.includes(possibleLang as UILanguages)) {
      return { locale: possibleLang as UILanguages, id: entryId.slice(firstSlash + 1) }
    }
    // Si hay un prefijo antes de la primera barra pero no es un lenguaje conocido,
    // consideramos esto un error de datos y lo hacemos explícito.
    throw new Error(`Unknown locale prefix "${possibleLang}" in entryId "${entryId}"`)
  }

  return { id: entryId }
}
