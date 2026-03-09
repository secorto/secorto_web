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
export type ParsedEntry = {
  seriesKey: string
  locale: string
  cleanId: string
  id: string
  title: string
  date?: Date
  translation_status?: string
}

/** Parse raw entries into a smaller shape used for grouping */
export function parseCollectionEntries(entries: Awaited<ReturnType<typeof getCollection>>): ParsedEntry[] {
  const parsed: ParsedEntry[] = []
  for (const entry of entries as any[]) {
    const [locale, ...rest] = entry.id.split("/")
    const cleanId = rest.join("/")
    const seriesKey: string = (entry.data as { postId?: string }).postId ?? cleanId
    const date = "date" in entry.data ? (entry.data.date as Date) : undefined

    parsed.push({
      seriesKey,
      locale,
      cleanId,
      id: entry.id,
      title: entry.data.title,
      date,
      translation_status: entry.data.translation_status,
    })
  }
  return parsed
}

/** Group parsed entries into seriesMap: seriesKey -> locale -> TranslationEntry */
export function groupBySeries(parsed: ParsedEntry[]): Record<string, Record<string, TranslationEntry>> {
  const seriesMap: Record<string, Record<string, TranslationEntry>> = {}
  for (const p of parsed) {
    if (!seriesMap[p.seriesKey]) seriesMap[p.seriesKey] = {}
    seriesMap[p.seriesKey][p.locale] = {
      id: p.id,
      slug: p.cleanId,
      title: p.title,
      date: p.date,
      translation_status: p.translation_status,
    }
  }
  return seriesMap
}

/** Build indices: seriesByKey and slugIndex (slug -> seriesKey) */
export function buildIndexes(seriesMap: Record<string, Record<string, TranslationEntry>>) {
  const seriesByKey = { ...seriesMap }
  const slugIndex: Record<string, string> = {}
  for (const [seriesKey, localeEntries] of Object.entries(seriesByKey)) {
    for (const localeEntry of Object.values(localeEntries)) {
      slugIndex[localeEntry.slug] = seriesKey
    }
  }
  return { seriesByKey, slugIndex }
}

export async function buildTranslationMap(
  collectionName: CollectionKey
): Promise<TranslationMap> {
  const entries = await getCollection(collectionName)

  const parsed = parseCollectionEntries(entries)
  const seriesMap = groupBySeries(parsed)
  const { seriesByKey, slugIndex } = buildIndexes(seriesMap)

  // Build result: keep seriesKey -> entries, and also expose slug -> entries
  const result: TranslationMap = {}
  for (const [seriesKey, localeEntries] of Object.entries(seriesByKey)) {
    result[seriesKey] = localeEntries
  }
  for (const [slug, seriesKey] of Object.entries(slugIndex)) {
    result[slug] = result[seriesKey]
  }

  return result
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
