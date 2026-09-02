/**
 * Represents a localized entry in the translation system.
 * @template E - The type of the content (e.g., { title: string, body: string }).
 * @template C - The section of the application (e.g., 'blog', 'docs').
 * @template L - The language code (e.g., 'es', 'en').
 */
export interface LocalizedEntry<
  TSection,
  TEntry,
  TLocale extends string
> {
  section: TSection
  cleanId: string
  translationKey: string
  locale: TLocale
  draft: boolean
  original: TEntry
}

/**
 * Represents a translation index that groups localized entries by their translation key and locale.
 * @template L - The type of the language code (e.g., 'es', 'en').
 * @template E - The type of the content (e.g., { title: string, body: string }).
 * @template C - The section of the application (e.g., 'blog', 'docs').
 */
export type TranslationGroup<
  TSection extends string,
  TLocale extends string,
  TEntry,
> = Partial<Record<TLocale, LocalizedEntry<TSection, TEntry, TLocale>>>

export type TranslationIndex<
  TSection extends string,
  L extends string,
  TEntry
> = Partial<Record<string, TranslationGroup<TSection, L, TEntry>>>

/**
 * Builds a translation index from an array of localized entries.
 * The index groups entries by their translation key and locale.
 * If duplicate entries for the same translation key and locale are found, an error is thrown.
 *
 * Invariant: a key is only inserted into the map after at least one locale
 * has been assigned to it. An empty group is therefore an invalid state.
 *
 * @template E - The type of the content (e.g., { title: string, body: string }).
 * @template C - The section of the application (e.g., 'blog', 'docs').
 * @template L - The language code (e.g., 'es', 'en').
 * @param entries Entries to index
 * @returns The translation index, grouped by translation key and locale
 * @throws Error if duplicate entries for the same translation key and locale are found
 */
export function createTranslationIndex<
  TSection extends string,
  TLocale extends string,
  TEntry
>(
  entries: readonly LocalizedEntry<TSection, TEntry, TLocale>[]
): TranslationIndex<TSection, TLocale, TEntry> {
  // Using map to safely mutate internally without lying to TypeScript.
  const map = new Map<string, TranslationGroup<TSection, TLocale, TEntry>>()

  for (const entry of entries) {
    const key = entry.translationKey
    const locale = entry.locale

    let group = map.get(key)
    if (!group) {
      group = Object.create(null) as TranslationGroup<TSection, TLocale, TEntry>
      map.set(key, group)
    } else if (locale in group) {
      throw new Error(
        `Duplicate translation for key "${key}" and locale "${locale}"`
      )
    }

    group[locale] = entry
  }

  return Object.fromEntries(map)
}
