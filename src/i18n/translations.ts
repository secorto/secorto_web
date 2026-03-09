import { buildTranslationPayload } from "./buildTranslationMap"

// Resolved: translations and translationStructures are populated from a
// single payload per collection via `buildTranslationPayload`.

// Old map kept for backward compatibility
// Build translations + structures while loading each collection only once
const blogPayload = await buildTranslationPayload('blog')
const workPayload = await buildTranslationPayload('work')
const projectPayload = await buildTranslationPayload('projects')
const communityPayload = await buildTranslationPayload('community')
const talkPayload = await buildTranslationPayload('talk')

export const translations = {
  blog: blogPayload.translationMap,
  work: workPayload.translationMap,
  project: projectPayload.translationMap,
  community: communityPayload.translationMap,
  talk: talkPayload.translationMap,
}

// New structures (seriesByKey + slugIndex) for memory/clarity and better consumers
export const translationStructures = {
  blog: { seriesByKey: blogPayload.seriesByKey, slugIndex: blogPayload.slugIndex },
  work: { seriesByKey: workPayload.seriesByKey, slugIndex: workPayload.slugIndex },
  project: { seriesByKey: projectPayload.seriesByKey, slugIndex: projectPayload.slugIndex },
  community: { seriesByKey: communityPayload.seriesByKey, slugIndex: communityPayload.slugIndex },
  talk: { seriesByKey: talkPayload.seriesByKey, slugIndex: talkPayload.slugIndex },
}
