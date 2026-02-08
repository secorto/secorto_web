import { languageKeys } from '@i18n/ui'

/**
 * Elimina el prefijo de locale de un id de entrada (ej: 'es/mi-post' -> 'mi-post')
 */
export function extractCleanId(entryId: string): string {
  return languageKeys.reduce((id, lang) => id.replace(new RegExp(`^${lang}/`), ''), entryId)
}
