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
  type FetchCollection,
  type SectionPath,
  type TagPath,
  type DetailPath
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
 * @param fetchCollection - Función para obtener colecciones (inyectada para testing)
 * @returns Array de paths para getStaticPaths
 */
export async function buildAllDetailPaths(
  fetchCollection: FetchCollection
): Promise<DetailPath[]> {
  return buildAllDetailPathsCore(Object.values(sectionsConfig), fetchCollection)
}

// Re-export del Core para casos específicos
export { buildSectionIndexPathsCore, buildTagPathsCore, buildAllDetailPathsCore }
export type { SectionPath, TagPath, DetailPath, FetchCollection }
