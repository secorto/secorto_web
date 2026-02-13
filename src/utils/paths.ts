import { getCollection } from "astro:content"
import type { CollectionEntry, CollectionKey } from "astro:content"
import { extractCleanId } from "@utils/ids"

export type CollectionWithTags = 'blog'|'talk'

export type EntryWithCleanId<C extends CollectionKey> = CollectionEntry<C> & { cleanId: string, excerpt?: string }

/**
 * Obtiene todos los posts de una colección para un locale específico.
 * Enriquece cada post con su cleanId (slug o nombre de archivo limpio).
 * @param collection - Nombre de la colección
 * @param locale - Idioma/locale
 * @returns Array de posts ordenados por cleanId descendente
 */
export async function getPostsByLocale<C extends CollectionKey>(
  collection: C,
  locale: string
): Promise<EntryWithCleanId<C>[]> {
  const posts = await getCollection(collection);
  return posts
    .filter(post => post.id.startsWith(`${locale}/`))
    .map(post => ({
      ...post,
      cleanId: post.data.slug || extractCleanId(post.id)
    }))
    .sort((a, b) => b.cleanId.localeCompare(a.cleanId))
}

/**
 * Extrae todos los tags únicos de un array de posts.
 * @param posts - Array de posts con data.tags
 * @returns Array de tags únicos ordenados alfabéticamente
 */
export function getUniqueTags(posts: { data: { tags?: string[] } }[]) {
  return [...new Set(
    posts.flatMap((post) => {
      const maybeTags = post.data.tags
      return maybeTags ?? []
    })
  )].sort((a, b) => a.localeCompare(b))
}
