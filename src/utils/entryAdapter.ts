import type { CollectionEntry, CollectionKey } from 'astro:content'
import { extractCleanId } from './ids'
import type { ComputedFields } from '@domain/entryComputed'
import type { PostEntry } from '@domain/post'

/**
 * Adapter: convierte una `CollectionEntry` -> `DomainEntry` (computed fields agregados)
 * - No realiza fallbacks agresivos: sólo calcula `cleanId` y `canonicalId` (desde `data.postId` o `cleanId`)
 */
export function adaptToDomainEntry<C extends CollectionKey = CollectionKey>(entry: CollectionEntry<C>): PostEntry<C> {
  const cleanId = extractCleanId(entry.id)
  const canonicalId = entry.data.postId ?? cleanId

  const computed: ComputedFields = {
    cleanId,
    canonicalId
  }
  return {
    ...entry,
    ...computed
  }
}
