import type { CollectionKey } from 'astro:content'
import type { UILanguages } from '@i18n/ui'
import { ui } from '@i18n/ui'

export type SectionType = 'blog' | 'talk' | 'work' | 'project' | 'community'
export type TranslationKey = keyof typeof ui[keyof typeof ui]

export interface SectionConfig {
  /** Clave de la colección en Astro */
  collection: CollectionKey
  /** Etiqueta de traducción para el título */
  translationKey: TranslationKey
  /** Si la sección tiene tags */
  hasTags: boolean
  /** Clave de traducción para "tagged with" (ej: 'blog.tagged', 'talk.tagged') */
  taggedKey?: TranslationKey
  /** Rutas por idioma: { locale -> ruta_url } */
  routes: Record<UILanguages, string>
  /** Componente a usar para listar items */
  listComponent: 'ListPost' | 'ListWork'
  /** Si mostrar imagen destacada */
  showFeaturedImage: boolean
}

export const sectionsConfig: Record<SectionType, SectionConfig> = {
  blog: {
    collection: 'blog',
    translationKey: 'nav.blog',
    hasTags: true,
    taggedKey: 'blog.tagged',
    routes: {
      es: 'blog',
      en: 'blog'
    },
    listComponent: 'ListPost',
    showFeaturedImage: true
  },
  talk: {
    collection: 'talk',
    translationKey: 'nav.talks',
    hasTags: true,
    taggedKey: 'talk.tagged',
    routes: {
      es: 'charla',
      en: 'talk'
    },
    listComponent: 'ListPost',
    showFeaturedImage: true
  },
  work: {
    collection: 'work',
    translationKey: 'nav.work',
    hasTags: false,
    routes: {
      es: 'trabajo',
      en: 'work'
    },
    listComponent: 'ListWork',
    showFeaturedImage: false
  },
  project: {
    collection: 'projects',
    translationKey: 'nav.projects',
    hasTags: false,
    routes: {
      es: 'proyecto',
      en: 'project'
    },
    listComponent: 'ListPost',
    showFeaturedImage: true
  },
  community: {
    collection: 'community',
    translationKey: 'nav.community',
    hasTags: false,
    routes: {
      es: 'comunidad',
      en: 'community'
    },
    listComponent: 'ListPost',
    showFeaturedImage: true
  }
}

/**
 * Obtiene la configuración de una sección basada en la ruta URL
 */
export function getSectionConfigByRoute(
  routeParam: string,
  locale: UILanguages
): SectionConfig | null {
  for (const [_key, config] of Object.entries(sectionsConfig)) {
    if (config.routes[locale] === routeParam) {
      return config
    }
  }
  return null
}

/**
 * Obtiene todas las rutas para una sección en todos los idiomas
 */
export function getAllRoutesForSection(sectionType: SectionType): string[] {
  const config = sectionsConfig[sectionType]
  return Object.values(config.routes)
}

/**
 * Obtiene la ruta (slug) para una sección en un idioma concreto
 */
export function getSectionRoute(section: SectionType, locale: UILanguages): string {
  return sectionsConfig[section].routes[locale]
}
