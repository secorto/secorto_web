import { getCollection, type CollectionKey } from "astro:content";

export type TranslationEntry = {
  id: string;
  /** File-based clean ID (used as URL slug for this locale) */
  slug: string;
  title: string;
  date?: Date;
  draft?: boolean
  canonical?: boolean
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
 *   1. Any entry with `data.canonical === true` (if present)
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
  draft?: boolean
  canonical?: boolean
}
/** Raw entry shape returned by `astro:content#getCollection` (subset used here) */
export type RawEntry = {
  id: string
  data: {
    title: string
    postId?: string
    date?: Date
    draft?: boolean
    canonical?: boolean
  }
}

/** Parse raw entries into a smaller shape used for grouping */
export function parseCollectionEntries(entries: RawEntry[]): ParsedEntry[] {
  const parsed: ParsedEntry[] = []
  for (const entry of entries) {
    const [locale, ...rest] = entry.id.split("/")
    const cleanId = rest.join("/")
    const seriesKey: string = entry.data.postId ?? cleanId
    const date = entry.data.date
    const draft = entry.data.draft
    const canonical = entry.data.canonical
    parsed.push({
      seriesKey,
      locale,
      cleanId,
      id: entry.id,
      title: entry.data.title,
      date,
      draft,
      canonical,
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
      draft: p.draft,
      canonical: p.canonical,
    }
  }
  return seriesMap
}

/** Build indices: seriesByKey and slugIndex (slug -> seriesKey) */
export function buildIndexes(seriesMap: Record<string, Record<string, TranslationEntry>>): {
  seriesByKey: Record<string, Record<string, TranslationEntry>>
  slugIndex: Record<string, string>
} {
  const seriesByKey: Record<string, Record<string, TranslationEntry>> = { ...seriesMap }
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
