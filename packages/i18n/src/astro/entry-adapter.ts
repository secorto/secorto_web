import { extractCleanId } from '../core'
import type { Locales } from '../core'
import type { LocalizedEntry } from '../section/translation-index'

/**
 * Represents a generic entry from a content source mapped to the application domain.
 *
 * @template TSection Section identifier (for example: `'blog' | 'docs'`).
 * @template TData The raw data schema type inside the entry (e.g., frontmatter shape).
 */
export interface GenericCollectionEntry<
  TSection extends string,
  TData
> {
  id: string
  collection: TSection
  data: TData
}

/**
 * Resolves the translation key used to group related content entries together.
 *
 * Checks if a custom `translationKey` string exists inside the entry data. 
 * If it does not exist, it falls back to the provided clean identifier.
 *
 * @template TData The raw data schema type inside the entry.
 * @param data The entry data object to inspect.
 * @param cleanId The identifier used as a fallback if no translation key is found.
 * @returns The resolved translation key.
 */
export function resolveTranslationKey<TData extends object>(
  data: TData,
  cleanId: string
): string {
  return 'translationKey' in data &&
    typeof (data as Record<string, unknown>).translationKey === 'string'
    ? (data as Record<string, unknown>).translationKey as string
    : cleanId
}

/**
 * Converts a collection entry into a localized entry.
 *
 * Extracts the locale and clean ID from the entry ID and resolves the
 * translation key used to group translations of the same content.
 *
 * @template TSection Section identifier (for example: `'blog' | 'docs'`).
 * @template TData The raw data schema type inside the entry (e.g., frontmatter shape).
 * @template TLocale Locale identifier (for example: `'en' | 'es'`).
 * @template TEntry The full collection entry object shape containing both id and data.
 *
 * @param entry Collection entry to adapt.
 * @param locales Supported locales used to parse the entry ID.
 * @returns The corresponding localized entry.
 */
export function adaptToLocalizedEntry<
  TSection extends string,
  TData extends object,
  TLocale extends string,
  TEntry extends GenericCollectionEntry<TSection, TData>
>(
  entry: TEntry,
  locales: Locales<TLocale>
): LocalizedEntry<TSection, TEntry, TLocale> {
  const { locale, id: cleanId } =
    extractCleanId(entry.id, locales)

  const draft = 'draft' in entry.data && entry.data.draft === true

  return {
    section: entry.collection,
    cleanId,
    locale,
    translationKey: resolveTranslationKey(
      entry.data,
      cleanId
    ),
    draft,
    original: entry,
  }
}
