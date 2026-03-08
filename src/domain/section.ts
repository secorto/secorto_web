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
  /** Clave de traducción para "tagged with" (ej: 'blog.tagged', 'talk.tagged') */
  taggedKey?: TranslationKey
  /** Rutas por idioma: { locale -> ruta_url } */
  routes: Record<UILanguages, string>
  /** Componente a usar para listar items */
  listComponent: 'ListPost' | 'ListWork'
  /** Componente a usar para vista de detalle */
  detailComponent: 'BlogTalkPostView' | 'WorkProjectCommunityView'
  /** Si mostrar imagen destacada */
  showFeaturedImage: boolean
}

export const sectionsConfig: Record<SectionType, SectionConfig> = {
  blog: {
    collection: 'blog',
    translationKey: 'nav.blog',
    taggedKey: 'blog.tagged',
    routes: {
      es: 'blog',
      en: 'blog'
    },
    listComponent: 'ListPost',
    detailComponent: 'BlogTalkPostView',
    showFeaturedImage: true
  },
  talk: {
    collection: 'talk',
    translationKey: 'nav.talks',
    taggedKey: 'talk.tagged',
    routes: {
      es: 'charla',
      en: 'talk'
    },
    listComponent: 'ListPost',
    detailComponent: 'BlogTalkPostView',
    showFeaturedImage: true
  },
  work: {
    collection: 'work',
    translationKey: 'nav.work',
    routes: {
      es: 'trabajo',
      en: 'work'
    },
    listComponent: 'ListWork',
    detailComponent: 'WorkProjectCommunityView',
    showFeaturedImage: false
  },
  project: {
    collection: 'projects',
    translationKey: 'nav.projects',
    routes: {
      es: 'proyecto',
      en: 'project'
    },
    listComponent: 'ListPost',
    detailComponent: 'WorkProjectCommunityView',
    showFeaturedImage: true
  },
  community: {
    collection: 'community',
    translationKey: 'nav.community',
    routes: {
      es: 'comunidad',
      en: 'community'
    },
    listComponent: 'ListPost',
    detailComponent: 'WorkProjectCommunityView',
    showFeaturedImage: true
  }
}
