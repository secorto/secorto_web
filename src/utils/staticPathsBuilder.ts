import { languageKeys, type UILanguages } from '@i18n/ui'
import { sectionsConfig, type SectionConfig } from '@config/sections'
import { getPostsByLocale, getUniqueTags } from './paths'
import { extractCleanId } from './ids'
import type { CollectionEntry, CollectionKey } from 'astro:content'

export interface SectionPath {
  params: {
    locale: UILanguages
    section: string
  }
}

export interface TagPath {
  params: {
    locale: UILanguages
    section: string
    tag: string
  }
  props: {
    tag: string
  }
}

export interface DetailPath {
  params: {
    locale: UILanguages
    section: string
    id: string
  }
}

interface EntryWithSlug {
  id: string
  data: {
    slug?: string
    [key: string]: unknown
  }
}

/**
 * Helper: Retorna iterador de todas las secciones.
 */
function* iterateSections(): Generator<SectionConfig> {
  for (const [_, config] of Object.entries(sectionsConfig)) {
    yield config
  }
}

/**
 * Helper: Retorna iterador de todas las combinaciones sección×locale.
 * @param filter - Filtro opcional para secciones
 */
function* iterateSectionLocales(
  filter?: (config: SectionConfig) => boolean
): Generator<[SectionConfig, UILanguages]> {
  for (const config of iterateSections()) {
    if (filter && !filter(config)) continue

    for (const locale of languageKeys) {
      yield [config, locale]
    }
  }
}

/**
 * Construye todas las rutas estáticas para índices de secciones.
 * Genera una ruta por sección × idioma.
 * @returns Array de paths para getStaticPaths
 */
export async function buildSectionIndexPaths(): Promise<SectionPath[]> {
  const paths: SectionPath[] = []

  for (const [config, locale] of iterateSectionLocales()) {
    paths.push({
      params: {
        locale,
        section: config.routes[locale]
      }
    })
  }

  return paths
}

/**
 * Construye todas las rutas estáticas para páginas de tags.
 * Solo genera rutas para secciones que tienen tags habilitados.
 * Recolecta tags únicos de todos los locales y genera rutas para cada combinación.
 * @param fetchPostsByLocale - Función para obtener posts por locale (inyectada para testing)
 * @returns Array de paths para getStaticPaths
 */
export async function buildTagPaths(
  fetchPostsByLocale: (collection: CollectionKey, locale: string) => Promise<{ data: { tags?: string[] } }[]> = getPostsByLocale as never
): Promise<TagPath[]> {
  const paths: TagPath[] = []

  for (const [config, locale] of iterateSectionLocales(c => c.hasTags)) {
    const posts = await fetchPostsByLocale(config.collection, locale)
    const tags = getUniqueTags(posts)

    for (const tag of tags) {
      paths.push({
        params: {
          locale,
          section: config.routes[locale],
          tag
        },
        props: { tag }
      })
    }
  }

  return paths
}

/**
 * Construye paths de detalle para una sección específica.
 * Función pura: solo transforma datos sin efectos secundarios.
 * @param entries - Entradas de la colección
 * @param config - Configuración de la sección
 * @param locales - Array de locales a procesar (por defecto todos los languageKeys)
 * @returns Array de paths de detalle para esta sección
 */
export function buildDetailPathsForSection(
  entries: EntryWithSlug[],
  config: SectionConfig,
  locales: readonly UILanguages[] = languageKeys
): DetailPath[] {
  const paths: DetailPath[] = []

  for (const locale of locales) {
    const sectionRoute = config.routes[locale]
    const entriesForLocale = entries.filter((e) => e.id.startsWith(`${locale}/`))

    for (const entry of entriesForLocale) {
      const fileCleanId = extractCleanId(entry.id)
      const entrySlug = entry.data.slug || fileCleanId

      paths.push({
        params: {
          locale,
          section: sectionRoute,
          id: entrySlug
        }
      })
    }
  }

  return paths
}

/**
 * Construye todas las rutas estáticas para páginas de detalle.
 * Genera una ruta por entrada × idioma en todas las secciones.
 * @param getCollection - Función para obtener colecciones (inyectada para testing)
 * @returns Array de paths para getStaticPaths
 */
export async function buildAllDetailPaths(
  getCollection: <C extends CollectionKey>(collection: C) => Promise<CollectionEntry<C>[]>
): Promise<DetailPath[]> {
  const allPaths: DetailPath[] = []

  for (const config of iterateSections()) {
    const allEntries = await getCollection(config.collection)
    const paths = buildDetailPathsForSection(
      allEntries as EntryWithSlug[],
      config
    )
    allPaths.push(...paths)
  }

  return allPaths
}
