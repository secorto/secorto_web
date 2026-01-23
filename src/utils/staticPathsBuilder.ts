import { languageKeys, type UILanguages } from '@i18n/ui'
import { sectionsConfig, type SectionConfig } from '@config/sections'
import { getPostsByLocale, getUniqueTags } from './paths'

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
 * Recolecta tags únicos de todos los locales y genera rutas para cada combinación.
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
      const posts = await getPostsByLocale(config.collection as never, locale)
      const tags = getUniqueTags(posts)
      for (const tag of tags) {
        allTags.add(tag)
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
