import { getCollection } from "astro:content";
import type { CollectionEntry, CollectionKey } from "astro:content";
type CollectionWithTags = 'blog'|'talk'

export type EntriesPath<C extends CollectionKey> =  {
  params: {
    id: string
  },
  props: {
    entry: CollectionEntry<C>
  }
}

export type TagsPath<C extends CollectionWithTags> =  {
  params: {
    tag: string
  },
  props: {
    posts: CollectionEntry<C>[],
    tags: string[]
  }
}

export type EntriesStaticPaths<C extends CollectionKey> = Promise<EntriesPath<C>[]>
export type TagsStaticPaths<C extends CollectionWithTags> = Promise<TagsPath<C>[]>


/**
 * Generates the static paths of any entry page
 * @param collectionName should be any CollectionKey defined on astro.config.mjs
 * @returns A promise with the Entries paths
 */
export const getEntriesPaths = async (collectionName: CollectionKey): EntriesStaticPaths<CollectionKey> =>  {
  const entries: CollectionEntry<CollectionKey>[] = await getCollection<CollectionKey>(collectionName);
  return entries.map(entry => ({
    params: { id: entry.id }, props: { entry },
  }));
}

/**
 * Generates the static paths of a tags page
 * @param collectionName should be a collection that has tags for example 'blog' or 'talk'
 * @returns A promise with the Tags paths
 */
export async function getTagsPaths(collectionName: CollectionWithTags): TagsStaticPaths<CollectionWithTags> {
  const allPosts = (await getCollection<CollectionWithTags>(collectionName)).sort((a, b)=> b.id.localeCompare(a.id));
  const uniqueTags = [...new Set(allPosts.map((post) => post.data.tags).flat())].sort((a, b)=> a.localeCompare(b));

  return uniqueTags.map((tag) => {
    const filteredPosts = allPosts.filter((post) => post.data.tags.includes(tag));
    return {
      params: { tag },
      props: { posts: filteredPosts, tags: uniqueTags },
    };
  });
}
