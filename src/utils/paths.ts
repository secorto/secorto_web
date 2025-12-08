import type { UILanguages } from "@i18n/ui";
import { getCollection } from "astro:content";
import type { CollectionEntry, CollectionKey } from "astro:content";
export type CollectionWithTags = 'blog'|'talk'

export type EntryWithCleanId<C extends CollectionKey> = CollectionEntry<C> & { cleanId: string };

export type EntriesPath<C extends CollectionKey> =  {
  params: {
    id: string,
    locale: UILanguages
  },
  props: {
    entry: CollectionEntry<C>
  }
}

export type TagsPath<C extends CollectionWithTags> =  {
  params: {
    tag: string,
    locale: UILanguages
  },
  props: {
    posts: EntryWithCleanId<C>[],
    tags: string[]
  }
}

export type EntriesStaticPaths<C extends CollectionKey> = Promise<EntriesPath<C>[]>
export type TagsStaticPaths<C extends CollectionWithTags> = Promise<TagsPath<C>[]>

export async function getPostsByLocale<C extends CollectionKey>(
  collection: C,
  locale: string
): Promise<EntryWithCleanId<C>[]> {
  const posts = await getCollection(collection);
  return posts
    .filter(post => post.id.startsWith(`${locale}/`))
    .map(post => ({
      ...post,
      cleanId: (post.data as any).slug || post.id.replace(/^(en|es)\//, '') // Usa slug si existe, sino el cleanId del filename
    }))
    .sort((a, b) => b.cleanId.localeCompare(a.cleanId));
}

export function getUniqueTags(posts: any[]) {
  return [...new Set(posts.map((post) => post.data.tags).flat())].sort((a, b) => a.localeCompare(b));
}

/**
 * Generates the static paths of any entry page
 * @param collectionName should be any CollectionKey defined on astro.config.mjs
 * @returns A promise with the Entries paths
 */
export const getEntriesPaths = async (collectionName: CollectionKey): EntriesStaticPaths<CollectionKey> =>  {
  const entries: CollectionEntry<CollectionKey>[] = await getCollection<CollectionKey>(collectionName);
  return entries.map(entry => {
    // Extrae el locale y el id limpio (o slug si existe)
    const [locale, ...rest] = entry.id.split('/');
    const fileCleanId = rest.join('/');
    const cleanId = (entry.data as any).slug || fileCleanId;
    return {
      params: { locale: locale as UILanguages, id: cleanId },
      props: { entry },
    };
  });
}

/**
 * Generates the static paths of a tags page
 * @param collectionName should be a collection that has tags for example 'blog' or 'talk'
 * @returns A promise with the Tags paths
 */
export async function getTagsPaths(
  collectionName: CollectionWithTags,
  locale: string
): TagsStaticPaths<CollectionWithTags> {
  const allPosts = await getPostsByLocale(collectionName, locale);
  const uniqueTags = getUniqueTags(allPosts);

  return uniqueTags.map((tag) => {
    const filteredPosts = allPosts.filter((post) => post.data.tags.includes(tag));
    return {
      params: { locale: locale as UILanguages, tag },
      props: { posts: filteredPosts, tags: uniqueTags },
    };
  });
}
