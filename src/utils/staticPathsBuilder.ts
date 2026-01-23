import { languageKeys, type UILanguages } from '@i18n/ui'
import { sectionsConfig, type SectionConfig } from '@config/sections'
import { getTagsPaths, getPostsByLocale } from './paths'

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

/**
 * Construye todas las rutas estáticas para índices de secciones.
 * Genera una ruta por sección × idioma.
 * @returns Array de paths para getStaticPaths
 */
export async function buildSectionIndexPaths(): Promise<SectionPath[]> {
  const paths: SectionPath[] = []

  for (const [_, config] of Object.entries(sectionsConfig)) {
    for (const locale of languageKeys) {
      paths.push({
        params: {
          locale,
          section: config.routes[locale]
        }
      })
    }
  }

  return paths
}

/**
 * Construye todas las rutas estáticas para páginas de tags.
 * Solo genera rutas para secciones que tienen tags habilitados.
 * @returns Array de paths para getStaticPaths
 */
export async function buildTagPaths(): Promise<TagPath[]> {
  const paths: TagPath[] = []

  for (const [_, config] of Object.entries(sectionsConfig)) {
    if (!config.hasTags) continue

    const locales = Object.keys(config.routes) as UILanguages[]

    // 1. Recolectar todos los tags únicos de todos los locales
    const allTags = new Set<string>()

    for (const locale of locales) {
      const tagPaths = await getTagsPaths(config.collection as never, locale)
      for (const tagPath of tagPaths) {
        allTags.add(tagPath.params.tag)
      }
    }

    // 2. Generar rutas para cada locale × tag
    for (const locale of locales) {
      for (const tag of allTags) {
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
  }

  return paths
}
