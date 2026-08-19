/**
 * Represents a localized entry in the translation system.
 * @template E - The type of the content (e.g., { title: string, body: string }).
 * @template C - The section of the application (e.g., 'blog', 'docs').
 * @template L - The language code (e.g., 'es', 'en').
 */
export interface LocalizedEntry<
  E,
  C extends string,
  L extends string
> {
  cleanId: string
  translationKey: string
  locale: L
  section: C
  entry: E
}

/**
 * Represents a translation index that groups localized entries by their translation key and locale.
 * @template L - The type of the language code (e.g., 'es', 'en').
 * @template E - The type of the content (e.g., { title: string, body: string }).
 * @template C - The section of the application (e.g., 'blog', 'docs').
 */
export type TranslationIndex<
  L extends string,
  E,
  C extends string
> = Record<string, Partial<Record<L, LocalizedEntry<E, C, L>>>>

/**
 * Builds a translation index from an array of localized entries.
 * The index groups entries by their translation key and locale.
 * If duplicate entries for the same translation key and locale are found, an error is thrown.
 * @template E - The type of the content (e.g., { title: string, body: string }).
 * @template C - The section of the application (e.g., 'blog', 'docs').
 * @template L - The language code (e.g., 'es', 'en').
 * @param entries Entries to index
 * @returns The translation index, grouped by translation key and locale
 * @throws Error if duplicate entries for the same translation key and locale are found
 */
export function buildTranslationIndex<
  L extends string,
  E,
  C extends string
>(
  entries: readonly LocalizedEntry<E, C, L>[]
): TranslationIndex<L, E, C> {
  // Using map to safely mutate internally without lying to TypeScript
  const map = new Map<string, Partial<Record<L, LocalizedEntry<E, C, L>>>>()

  for (const entry of entries) {
    const key = entry.translationKey
    const locale = entry.locale

    // Get or create the group for this key
    let group = map.get(key)
    if (!group) {
      group = {}
      map.set(key, group)
    } else if (locale in group) {
      throw new Error(
        `Duplicate translation for key "${key}" and locale "${locale}"`
      )
    }

    // Assign directly to the entry
    group[locale] = entry
  }
  return Object.fromEntries(map)
}

/**
 * Validates if the provided language is in the list of allowed locales and returns it as a type-safe value.
 * @param lang Language to validate
 * @param allowedLocales Allowed locales defined by caller
 * @returns The validated language code as a type-safe value
 */
export function langFromString<L extends string>(
  lang: string | undefined,
  allowedLocales: readonly L[]
): L {
  if (!lang) throw new TypeError(`Invalid language: ${lang}`)

  if (allowedLocales.includes(lang as L)) {
    return lang as L
  }

  throw new TypeError(`Invalid language: ${lang}`)
}
