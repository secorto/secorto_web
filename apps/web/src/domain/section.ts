import type { UILanguages } from '@i18n/ui'
import { ui } from '@i18n/ui'
import { createSectionRoutes, type SectionRoutes } from '@secorto/i18n'

export const sectionKeys = ['blog', 'talk', 'work', 'projects', 'community'] as const
export type SectionType = typeof sectionKeys[number]
export type EntryCategory = 'post' | 'experience'
export type TranslationKey = keyof typeof ui[keyof typeof ui]

export interface SectionConfig {
  /** Nombre de la sección — coincide con la clave de colección Astro */
  name: SectionType
  /** Tipo de entrada: 'post' para artículos, 'experience' para trabajo/proyectos/comunidad */
  category: EntryCategory
  /** Clave i18n para el título en la navegación */
  translationKey: TranslationKey
  /** URLs de la sección por idioma */
  routes: Record<UILanguages, string>
}

export const sectionsConfig: Record<SectionType, SectionConfig> = {
  blog: {
    name: 'blog',
    category: 'post',
    translationKey: 'nav.blog',
    routes: { es: 'blog', en: 'blog' },
  },
  talk: {
    name: 'talk',
    category: 'post',
    translationKey: 'nav.talks',
    routes: { es: 'charla', en: 'talk' },
  },
  work: {
    name: 'work',
    category: 'experience',
    translationKey: 'nav.work',
    routes: { es: 'trabajo', en: 'work' },
  },
  projects: {
    name: 'projects',
    category: 'experience',
    translationKey: 'nav.projects',
    routes: { es: 'proyecto', en: 'project' },
  },
  community: {
    name: 'community',
    category: 'experience',
    translationKey: 'nav.community',
    routes: { es: 'comunidad', en: 'community' },
  }
}

export const sectionRoutes: SectionRoutes<SectionType, UILanguages> = createSectionRoutes({
  blog: { es: 'blog', en: 'blog' },
  talk: { es: 'charla', en: 'talk' },
  work: { es: 'trabajo', en: 'work' },
  projects: { es: 'proyecto', en: 'project' },
  community: { es: 'comunidad', en: 'community' },
})
