import type { GenericCollectionEntry } from './entry-adapter'
export type Draftable = {
  draft?: boolean
}

export const availableAtLocale = <TLocale extends string>(locale: TLocale) =>
  <TSection extends string,
    TEntry extends GenericCollectionEntry<TSection, Draftable>
  >(entry: TEntry) => entry.id.startsWith(`${locale}/`) &&
      entry.data.draft !== true
