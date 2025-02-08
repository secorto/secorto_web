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

export const getEntriesPaths = async (collectionName: CollectionKey): Promise<EntriesPath<CollectionKey>[]> =>  {
  const entries: CollectionEntry<CollectionKey>[] = await getCollection<CollectionKey>(collectionName);
  return entries.map(entry => ({
    params: { id: entry.id }, props: { entry },
  }));
}

export async function getTagsPaths<C extends CollectionWithTags>(collectionName: C): Promise<TagsPath<CollectionWithTags>[]> {
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
