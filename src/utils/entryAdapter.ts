import type { CollectionEntry, CollectionKey } from 'astro:content'
import { extractCleanId } from './ids'
import type { ComputedFields } from '@domain/entryComputed'
import type { PostEntry } from '@domain/post'

/**
 * Adapter: convierte una `CollectionEntry` -> `DomainEntry` (computed fields agregados)
 * - No realiza fallbacks agresivos: sólo calcula `cleanId` y `postId` (desde `data.postId` o `cleanId`)
 */
export function adaptToDomainEntry<C extends CollectionKey = CollectionKey>(entry: CollectionEntry<C>): PostEntry<C> {
  const extracted = extractCleanId(entry.id)
  const cleanId = extracted.id
  const postId = entry.data.postId ?? cleanId

  const computed: ComputedFields = {
    cleanId,
    postId,
    locale: extracted.locale
  }
  return {
    ...entry,
    ...computed
  }
}
