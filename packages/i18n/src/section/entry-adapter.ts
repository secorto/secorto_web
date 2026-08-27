import { extractCleanId, Locales } from '../core'
import { LocalizedEntry } from './translation-index'

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
 * @param entry Collection entry to adapt.
 * @param locales Supported locales used to parse the entry ID.
 * @returns The corresponding localized entry.
 */
export function adaptToLocalizedEntry<
  TEntry extends GenericCollectionEntry<C, T>,
  T extends object,
  C extends string,
  L extends string
>(
  entry: TEntry,
  locales: Locales<L>
): LocalizedEntry<TEntry, L> {
  const { locale, id: cleanId } =
    extractCleanId(entry.id, locales)

  return {
    cleanId,
    locale,
    translationKey: resolveTranslationKey(
      entry.data,
      cleanId
    ),
    original: entry,
  }
}
