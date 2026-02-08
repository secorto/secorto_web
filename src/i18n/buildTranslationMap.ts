import { getCollection, type CollectionKey } from "astro:content";

export type TranslationEntry = {
  id: string;
  slug: string;
  title: string;
  date?: Date;
  translation_status?: string;
  translation_origin?: { locale: string; id: string } | null;
};

export type TranslationMap = Record<
  string,
  Record<string, TranslationEntry>
>;

export async function buildTranslationMap(
  collectionName: CollectionKey
): Promise<TranslationMap> {
  const entries = await getCollection(collectionName);

  return entries.reduce((acc, entry) => {
    const [locale, ...rest] = entry.id.split("/");
    const slug = rest.join("/");
    const canonical = entry.data.canonical ?? slug;

    const date =
      "date" in entry.data ? (entry.data.date as Date) : undefined;

    if (!acc[canonical]) acc[canonical] = {};
    acc[canonical][locale] = {
      id: entry.id,
      slug,
      title: entry.data.title,
      date,
      translation_status: entry.data.translation_status,
      translation_origin: entry.data.translation_origin,
    };

    return acc;
  }, {} as TranslationMap);
}
