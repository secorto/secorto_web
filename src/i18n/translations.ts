import { buildTranslationMap } from "./buildTranslationMap";

export const translations = {
  blog: await buildTranslationMap("blog"),
  work: await buildTranslationMap("work"),
  project: await buildTranslationMap("projects"),
  community: await buildTranslationMap("community"),
  talk: await buildTranslationMap("talk"),
};
