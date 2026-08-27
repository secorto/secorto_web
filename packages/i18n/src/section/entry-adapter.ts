import { extractCleanId, Locales } from "@secorto/i18n";
import { LocalizedEntry } from "./translation-index";

export interface GenericCollectionEntry<
  C extends string, 
  TData
> {
  id: string;
  collection: C;
  data: TData;
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
  T extends object, 
  C extends string, 
  L extends string
>(
  // Pasamos C y T para amarrar la colección y el esquema de datos exacto
  entry: GenericCollectionEntry<C, T>, 
  locales: Locales<L>
): LocalizedEntry<T, C, L> {
  const { locale, id: cleanId } = extractCleanId(entry.id, locales);
  
  return {
    cleanId,
    locale,
    section: entry.collection,
    translationKey: resolveTranslationKey(entry.data, cleanId),
    entry: entry.data
  };
}
