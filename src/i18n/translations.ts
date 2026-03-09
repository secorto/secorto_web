import { buildTranslationMap, parseCollectionEntries, groupBySeries, buildIndexes, type RawEntry } from "./buildTranslationMap";
import { getCollection, type CollectionKey } from 'astro:content'

// Old map kept for backward compatibility
export const translations = {
  blog: await buildTranslationMap("blog"),
  work: await buildTranslationMap("work"),
  project: await buildTranslationMap("projects"),
  community: await buildTranslationMap("community"),
  talk: await buildTranslationMap("talk"),
}

// New structures (seriesByKey + slugIndex) for memory/clarity and better consumers
async function buildStructures(collectionName: CollectionKey) {
  const entries = await getCollection(collectionName)
  const parsed = parseCollectionEntries(entries as RawEntry[])
  const seriesMap = groupBySeries(parsed)
  const { seriesByKey, slugIndex } = buildIndexes(seriesMap)
  return { seriesByKey, slugIndex }
}

export const translationStructures = {
  blog: await buildStructures('blog'),
  work: await buildStructures('work'),
  project: await buildStructures('projects'),
  community: await buildStructures('community'),
  talk: await buildStructures('talk'),
}
