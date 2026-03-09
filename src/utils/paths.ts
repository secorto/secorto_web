import { getCollection } from "astro:content"
import type { CollectionEntry, CollectionKey } from "astro:content"
import { extractCleanId } from "@utils/ids"

export type EntryWithCleanId<C extends CollectionKey> = CollectionEntry<C> & { cleanId: string, excerpt?: string }

/**
 * Filtra y enriquece entradas ya cargadas para un locale específico.
 * Función pura — el caller es responsable de llamar a getCollection.
 * @param entries - Entradas ya cargadas de la colección
 * @param locale - Idioma/locale
 * @returns Array de posts ordenados por cleanId descendente
 */
export function filterByLocale<C extends CollectionKey>(
  entries: CollectionEntry<C>[],
  locale: string
): EntryWithCleanId<C>[] {
  return entries
    .filter((post) => post.id.startsWith(`${locale}/`))
    .filter((post) => post.data.draft !== true)
    .map((post) => ({
      ...post,
      cleanId: extractCleanId(post.id)
    }))
    .sort((a, b) => b.cleanId.localeCompare(a.cleanId))
}

/**
 * Obtiene todos los posts de una colección para un locale específico.
 * Enriquece cada post con su cleanId (nombre de archivo limpio).
 * @param collection - Nombre de la colección
 * @param locale - Idioma/locale
 * @returns Array de posts ordenados por cleanId descendente
 */
export async function getPostsByLocale<C extends CollectionKey>(
  collection: C,
  locale: string
): Promise<EntryWithCleanId<C>[]> {
  const posts = await getCollection(collection)
  return filterByLocale(posts, locale)
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
