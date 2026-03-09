import { getCollection, type CollectionKey } from "astro:content";

export type TranslationEntry = {
  id: string;
  /** File-based clean ID (used as URL slug for this locale) */
  slug: string;
  title: string;
  date?: Date;
  translation_status?: string;
};

/**
 * Map keyed by every locale's URL slug (plus the shared postId when set).
 * All keys that belong to the same series point to the same locale→entry record.
 * This allows LanguagePicker to look up a series by the current URL slug,
 * regardless of which locale is active.
 */
export type TranslationMap = Record<string, Record<string, TranslationEntry>>;

/**
 * Builds a translation map for a given collection.
 *
 * Grouping priority per entry:
 *   1. `data.postId`  — explicit shared identifier across locales
 *   2. file-based clean ID (`locale/<...slug>` → `<...slug>`)
 *
 * Canonical locale selection per series (for draft SEO fallback):
 *   1. Any entry with `data.canonical === true`
 *   2. The `es` entry if present
 *   3. The first locale found
 *
 * The resulting map is indexed by EVERY locale's URL slug so that a lookup
 * by the current page slug always finds the full series.
 */
export async function buildTranslationMap(
  collectionName: CollectionKey
): Promise<TranslationMap> {
  const entries = await getCollection(collectionName);

  // Step 1: group entries into series by postId ?? cleanId
  const seriesMap: Record<string, Record<string, TranslationEntry>> = {};

  for (const entry of entries) {
    const [locale, ...rest] = entry.id.split("/");
    const cleanId = rest.join("/");
    const seriesKey: string = (entry.data as { postId?: string }).postId ?? cleanId;
    const date = "date" in entry.data ? (entry.data.date as Date) : undefined;

    if (!seriesMap[seriesKey]) seriesMap[seriesKey] = {};
    seriesMap[seriesKey][locale] = {
      id: entry.id,
      slug: cleanId,
      title: entry.data.title,
      date,
      translation_status: entry.data.translation_status,
    };
  }

  // Step 2: index by every locale's URL slug (and by postId/seriesKey)
  const result: TranslationMap = {};

  for (const [seriesKey, localeEntries] of Object.entries(seriesMap)) {
    result[seriesKey] = localeEntries;
    for (const localeEntry of Object.values(localeEntries)) {
      result[localeEntry.slug] = localeEntries;
    }
  }

  return result;
}

/**
 * Resolves the canonical locale for a series given the available locales.
 * Priority: `es` → first available.
 * The `canonical: true` frontmatter flag is resolved at getStaticPaths time
 * (too expensive to re-read per page); for page-level SEO use availableLocales.
 */
export function resolveSeriesCanonicalLocale(
  availableLocales: string[],
  defaultLocale = "es"
): string {
  if (availableLocales.includes(defaultLocale)) return defaultLocale;
  return availableLocales[0] ?? defaultLocale;
}
