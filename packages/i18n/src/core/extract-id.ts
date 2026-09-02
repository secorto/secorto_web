import type { Locales } from './locale'

/**
 * Extracts the locale and cleanId from an entryId of the form "es/my-post".
 * Locale validation is delegated to the Locales value object.
 *
 * @template TLocale Locale identifier (for example: `'en' | 'es'`).
 *
 * @param entryId Raw entry identifier (e.g., "es/my-post").
 * @param locales Locales value object created via createLocales().
 * @returns An object containing the validated locale and cleanId.
 * @throws {Error} If the entryId is empty, malformed, or the locale is invalid.
 */
export function extractCleanId<TLocale extends string>(
  entryId: string,
  locales: Locales<TLocale>
): { locale: TLocale; id: string } {
  if (!entryId) {
    throw new Error('entryId cannot be empty')
  }

  const firstSlash = entryId.indexOf('/')
  if (firstSlash <= 0) {
    throw new Error(`Invalid entryId "${entryId}" — missing locale prefix`)
  }

  const rawLocale = entryId.slice(0, firstSlash)

  if (!locales.isValid(rawLocale)) {
    throw new Error(
      `Invalid entryId "${entryId}". Unknown locale prefix "${rawLocale}". Expected one of: ${locales.all.join(', ')}.`
    )
  }

  const cleanId = entryId.slice(firstSlash + 1)

  return {
    locale: rawLocale,
    id: cleanId
  }
}
