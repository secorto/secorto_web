import { extractCleanId } from '../core'
import type { Locales } from '../core'
import type { LocalizedEntry } from '../section/translation-index'

export interface GenericCollectionEntry<
  C extends string,
  TData
> {
  id: string
  collection: C
  data: TData
}

export function resolveTranslationKey<T extends object>(
  data: T,
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
 * @template TOriginalEntry The raw data schema type inside the entry (e.g., frontmatter shape).
 * @template TLocale Locale identifier (for example: `'en' | 'es'`).
 * @template TEntry The full collection entry object shape containing both id and data.
 *
 * @param entry Collection entry to adapt.
 * @param locales Supported locales used to parse the entry ID.
 * @returns The corresponding localized entry.
 */
export function adaptToLocalizedEntry<
  TSection extends string,
  TOriginalEntry extends object,
  TLocale extends string,
  TEntry extends GenericCollectionEntry<TSection, TOriginalEntry>
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
