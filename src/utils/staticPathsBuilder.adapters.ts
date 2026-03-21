/**
 * Capa de Adapters: Inyección explícita de sectionsConfig al Core puro.
 * Este archivo encapsula todo el acoplamiento a la configuración global.
 * Los tests importan Core; la producción importa Adapters.
 */

import { getCollection } from 'astro:content'
import { sectionsConfig } from '@domain/section'
import {
  buildSectionIndexPathsCore,
  buildTagPathsCore,
  buildAllDetailPathsCore,
  buildTagIndexPathsCore,
  type FetchCollection,
  type SectionPath,
  type TagPath,
  type DetailPath,
  type TagIndexPath
} from './staticPathsBuilder'

/**
 * Adapter: Construye rutas de índices de secciones para producción.
 * Inyecta automáticamente sectionsConfig al Core.
 * @param fetchCollection - Inyectable para testing (default: getCollection de Astro)
 * @returns Array de paths para getStaticPaths
 */
export async function buildSectionIndexPaths(
  fetchCollection: FetchCollection = getCollection
): Promise<SectionPath[]> {
  return buildSectionIndexPathsCore(Object.values(sectionsConfig), fetchCollection)
}

/**
 * Adapter: Construye rutas de páginas de tags para producción.
 * Inyecta automáticamente sectionsConfig al Core.
 * @param fetchCollection - Inyectable para testing (default: getCollection de Astro)
 * @returns Array de paths para getStaticPaths
 */
export async function buildTagPaths(
  fetchCollection: FetchCollection = getCollection
): Promise<TagPath[]> {
  return buildTagPathsCore(Object.values(sectionsConfig), fetchCollection)
}

/**
 * Adapter: Construye rutas de páginas de detalle para producción.
 * Inyecta automáticamente sectionsConfig al Core.
 * @param fetchCollection - Inyectable para testing (default: getCollection de Astro)
 * @returns Array de paths para getStaticPaths
 */
export async function buildAllDetailPaths(
  fetchCollection: FetchCollection = getCollection
): Promise<DetailPath[]> {
  return buildAllDetailPathsCore(Object.values(sectionsConfig), fetchCollection)
}

/**
 * Adapter: Construye rutas del índice de tags global para producción.
 * Inyecta automáticamente sectionsConfig al Core.
 * Cachea las colecciones (una sola vez) para compartirlas con todas las rutas locales.
 * @param fetchCollection - Inyectable para testing (default: getCollection de Astro)
 * @returns Array de paths para getStaticPaths
 */
export async function buildTagIndexPaths(
  fetchCollection: FetchCollection = getCollection
): Promise<TagIndexPath[]> {
  return buildTagIndexPathsCore(Object.values(sectionsConfig), fetchCollection)
}

// Re-export del Core para casos específicos
export { buildSectionIndexPathsCore, buildTagPathsCore, buildAllDetailPathsCore, buildTagIndexPathsCore }
export type { SectionPath, TagPath, DetailPath, TagIndexPath, FetchCollection }
