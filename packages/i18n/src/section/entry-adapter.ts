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
