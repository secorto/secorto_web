import { getCollection } from "astro:content";
import type { CollectionKey } from "astro:content";
type CollectionWithTags = 'blog'|'talk'

export const getEntriesPaths = async (collectionName: CollectionKey) => {
  const entries = await getCollection(collectionName);
  return entries.map(entry => ({
    params: { id: entry.id }, props: { entry },
  }));
}

export const getTagsPaths = async (collectionName: CollectionWithTags) => {
  const allPosts = (await getCollection(collectionName)).sort((a, b)=> b.id.localeCompare(a.id));
  const uniqueTags = [...new Set(allPosts.map((post) => post.data.tags).flat())].sort((a, b)=> a.localeCompare(b));

  return uniqueTags.map((tag) => {
    const filteredPosts = allPosts.filter((post) => post.data.tags.includes(tag));
    return {
      params: { tag },
      props: { posts: filteredPosts, tags: uniqueTags },
    };
  });
}
