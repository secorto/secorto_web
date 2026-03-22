import type { UILanguages } from '@i18n/ui'
import { ui } from '@i18n/ui'

export type SectionType = 'blog' | 'talk' | 'work' | 'projects' | 'community'
export type EntryCategory = 'post' | 'experience'
export type TranslationKey = keyof typeof ui[keyof typeof ui]

export interface SectionConfig {
  /** Nombre de la sección — coincide con la clave de colección Astro */
  name: SectionType
  /** Tipo de entrada: 'post' para artículos, 'experience' para trabajo/proyectos/comunidad */
  category: EntryCategory
  /** Clave i18n para el título en la navegación */
  translationKey: TranslationKey
  /** Clave i18n opcional para etiquetas de la sección */
  taggedKey?: TranslationKey
  /** URLs de la sección por idioma */
  routes: Record<UILanguages, string>
  /** Si mostrar imagen destacada en listados y detalle de esta sección */
  showFeaturedImage: boolean
}

export const sectionsConfig: Record<SectionType, SectionConfig> = {
  blog: {
    name: 'blog',
    category: 'post',
    translationKey: 'nav.blog',
    taggedKey: 'blog.tagged',
    routes: { es: 'blog', en: 'blog' },
    showFeaturedImage: true
  },
  talk: {
    name: 'talk',
    category: 'post',
    translationKey: 'nav.talks',
    taggedKey: 'talk.tagged',
    routes: { es: 'charla', en: 'talk' },
    showFeaturedImage: true
  },
  work: {
    name: 'work',
    category: 'experience',
    translationKey: 'nav.work',
    routes: { es: 'trabajo', en: 'work' },
    showFeaturedImage: false
  },
  projects: {
    name: 'projects',
    category: 'experience',
    translationKey: 'nav.projects',
    routes: { es: 'proyecto', en: 'project' },
    showFeaturedImage: true
  },
  community: {
    name: 'community',
    category: 'experience',
    translationKey: 'nav.community',
    routes: { es: 'comunidad', en: 'community' },
    showFeaturedImage: true
  }
}
