import type { UILanguages } from '@i18n/ui'
import { ui } from '@i18n/ui'

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
  /** Clave i18n opcional para etiquetas de la sección */
  taggedKey?: TranslationKey
  /** Clave i18n para el botón CTA en listados */
  ctaKey: TranslationKey
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
    ctaKey: 'cta.blog',
    routes: { es: 'blog', en: 'blog' },
    showFeaturedImage: true
  },
  talk: {
    name: 'talk',
    category: 'post',
    translationKey: 'nav.talks',
    taggedKey: 'talk.tagged',
    ctaKey: 'cta.talk',
    routes: { es: 'charla', en: 'talk' },
    showFeaturedImage: true
  },
  work: {
    name: 'work',
    category: 'experience',
    translationKey: 'nav.work',
    ctaKey: 'cta.work',
    routes: { es: 'trabajo', en: 'work' },
    showFeaturedImage: false
  },
  projects: {
    name: 'projects',
    category: 'experience',
    translationKey: 'nav.projects',
    ctaKey: 'cta.project',
    routes: { es: 'proyecto', en: 'project' },
    showFeaturedImage: true
  },
  community: {
    name: 'community',
    category: 'experience',
    translationKey: 'nav.community',
    ctaKey: 'cta.community',
    routes: { es: 'comunidad', en: 'community' },
    showFeaturedImage: true
  }
}

/**
 * Obtiene la ruta (slug) para una sección en un idioma concreto
 */
export function getSectionRoute(section: SectionType, locale: UILanguages): string {
  return sectionsConfig[section].routes[locale]
}

/**
 * Get the url of a section in a specific locale
 * @param section section to get the url for
 * @param locale locale to get the url for
 * @returns route string for the section in the locale
 */
export function getURLForSection(
  section: SectionType,
  locale: UILanguages
): string {
  const route = getSectionRoute(section, locale)
  return `/${locale}/${route}`
}

/**
 * Gets the url of a specific entry in a section and locale
 * @param section section of the content
 * @param locale locale of the entry
 * @param slug clean id of the entry
 * @returns url string for the entry
 */
export function getEntryURL(
  section: SectionType,
  locale: UILanguages,
  slug: string
): string {
  return `${getURLForSection(section, locale)}/${slug}`
}

/**
 * Gets the url of a specific tag in a section and locale
 * @param section section of the content
 * @param locale locale of the entry
 * @param tag tag to get the url for
 * @returns url string for the tag in the section and locale
 */
export function getEntryTagURL(
  section: SectionType,
  locale: UILanguages,
  tag: string
): string {
  return `${getURLForSection(section, locale)}/tags/${tag}`
}

