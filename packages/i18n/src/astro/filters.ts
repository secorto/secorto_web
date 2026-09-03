import type { GenericCollectionEntry } from './entry-adapter'
export type Draftable = {
  draft?: boolean
}

/**
 * Creates an Astro `getCollection()` filter that:
 * - keeps only entries for the provided locale (expects ids like `${locale}/...`)
 * - excludes drafts (`draft === true`)
 */
export const availableAtLocale = <TLocale extends string>(locale: TLocale) =>
  <TSection extends string,
    TEntry extends GenericCollectionEntry<TSection, Draftable>
  >(entry: TEntry) => entry.id.startsWith(`${locale}/`) &&
      entry.data.draft !== true
