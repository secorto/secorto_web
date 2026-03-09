import type { UILanguages } from './ui'
import { languages, defaultLang, languageKeys } from './ui'
import { showDefaultLang } from '@i18n/config'
import { resolveLocalized, findCanonicalSectionKey, rootMap } from './rootMap'
export type AvailableLocales = Partial<Record<UILanguages, { slug: string; draft?: boolean; canonical?: boolean }>>

export interface TranslationLink {
  href: string
  label: string
  isAvailable: boolean
  disabledReason?: 'missing' | 'draft'
}

function buildLangPrefix(targetLang: UILanguages): string {
  return targetLang === defaultLang && !showDefaultLang ? "" : `/${targetLang}`
}

/**
 * Construye un link de language picker para la página de inicio.
 * @param targetLang - Idioma destino para el link
 * @returns Link disponible apuntando a la raíz del sitio en ese idioma
 */
export function buildHomeLink(targetLang: UILanguages): TranslationLink {
  return {
    href: `${buildLangPrefix(targetLang)}/`,
    label: languages[targetLang],
    isAvailable: true
  }
}

/**
 * Construye un link de language picker para páginas de tags.
 * @param targetLang - Idioma destino para el link
 * @param canonicalSection - Sección canónica (ej: 'blog', 'talk')
 * @param localeSlugs - Mapa locale → slug del tag en ese idioma (de buildTagLocaleMap)
 * @returns Link disponible si el locale tiene un slug, missing si no
 */
export function buildTagLink(
  targetLang: UILanguages,
  canonicalSection: string,
  localeSlugs: Partial<Record<UILanguages, string>>
): TranslationLink {
  const slug = localeSlugs[targetLang]
  if (!slug) {
    return { href: '', label: languages[targetLang], isAvailable: false, disabledReason: 'missing' }
  }
  const localizedSection = resolveLocalized(canonicalSection, targetLang)
  return {
    href: `${buildLangPrefix(targetLang)}/${localizedSection}/tags/${slug}`,
    label: languages[targetLang],
    isAvailable: true
  }
}

/**
 * Construye un link de language picker para páginas de detalle (posts, charlas, proyectos, etc).
 * Verifica si hay traducción disponible para el idioma destino.
 * @param targetLang - Idioma destino para el link
 * @param canonicalSection - Sección canónica (ej: 'blog', 'talk')
 * @param availableLocales - Mapa de traducciones disponibles por idioma para este contenido
 * @returns Link con disponibilidad según traducciones, incluye razón si no está disponible
 */
export function buildDetailLink(targetLang: UILanguages, canonicalSection: string, availableLocales: AvailableLocales): TranslationLink {
  const entry = availableLocales[targetLang]
  const localizedSection = resolveLocalized(canonicalSection, targetLang)

  if (!entry) {
    return { href: '', label: languages[targetLang], isAvailable: false, disabledReason: 'missing' }
  }

  return {
    href: `${buildLangPrefix(targetLang)}/${localizedSection}/${entry.slug}`,
    label: languages[targetLang],
    isAvailable: true,
    ...(entry.draft && { disabledReason: 'draft' as const })
  }
}

/**
 * Construye un link de language picker para índices de colecciones o páginas estáticas.
 * @param targetLang - Idioma destino para el link
 * @param canonicalSection - Sección canónica (ej: 'blog', 'about')
 * @returns Link disponible al índice de esa sección en ese idioma
 */
export function buildCollectionLink(targetLang: UILanguages, canonicalSection: string): TranslationLink {
  const localizedSection = resolveLocalized(canonicalSection, targetLang)
  return {
    href: `${buildLangPrefix(targetLang)}/${localizedSection}`,
    label: languages[targetLang],
    isAvailable: true
  }
}

/**
 * Construye el mapa completo de links para el LanguagePicker a partir de la URL de una página estática genérica.
 * Centraliza toda la lógica de detección de locale, resolución de sección y disponibilidad.
 * Funciona para cualquier página no basada en colecciones: markdown, Astro estático, etc.
 *
 * Escenarios:
 *  - Sin prefijo de locale (/cosito): todos los links → missing
 *  - Con prefijo de locale, sección en rootMap: available si existe entry, missing si no
 *  - Con prefijo de locale, sección NO en rootMap: solo el locale actual → available (self-link)
 *
 * @param url - URL completa de la página actual
 * @param canonicalSection - Override opcional desde frontmatter
 */
export function buildStaticPageLinks(
  url: URL,
  canonicalSection?: string
): Record<UILanguages, TranslationLink> {
  const [, maybeLocale, rawSegment] = url.pathname.split('/')
  const currentLocale = (languageKeys as string[]).includes(maybeLocale) ? maybeLocale as UILanguages : null
  const resolvedSection = currentLocale ? (canonicalSection ?? findCanonicalSectionKey(rawSegment, currentLocale)) : null
  const sectionMap = resolvedSection ? rootMap[resolvedSection] : null

  return Object.fromEntries(
    languageKeys.map(l => {
      const localizedSlug = sectionMap ? sectionMap[l] : (l === currentLocale ? rawSegment : undefined)
      const link: TranslationLink = localizedSlug
        ? { href: `${buildLangPrefix(l)}/${localizedSlug}`, label: languages[l], isAvailable: true }
        : { href: '', label: languages[l], isAvailable: false, disabledReason: 'missing' }
      return [l, link]
    })
  ) as Record<UILanguages, TranslationLink>
}
