import type { UILanguages } from './ui'
import { languages, defaultLang } from './ui'
import { showDefaultLang } from '@i18n/config'
import { resolveLocalized } from './rootMap'
export type AvailableLocales = Partial<Record<UILanguages, { slug: string; draft?: boolean }>>

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
 * @param slug - Slug de la página de tags incluyendo el prefijo (ej: 'tags/typescript')
 * @returns Link disponible a la página de tags en ese idioma
 */
export function buildTagLink(
  targetLang: UILanguages,
  canonicalSection: string,
  slug: string,
  availableLangs: Set<UILanguages>
): TranslationLink {
  if (!availableLangs.has(targetLang)) {
    return { href: '', label: languages[targetLang], isAvailable: false, disabledReason: 'missing' }
  }
  const localizedSection = resolveLocalized(canonicalSection, targetLang)
  return {
    href: `${buildLangPrefix(targetLang)}/${localizedSection}/${slug}`,
    label: languages[targetLang],
    isAvailable: true
  }
}

/**
 * Construye un link de language picker para páginas de detalle (posts, charlas, proyectos, etc).
 * Verifica si hay traducción disponible para el idioma destino.
 * @param targetLang - Idioma destino para el link
 * @param canonicalSection - Sección canónica (ej: 'blog', 'talk')
 * @param slug - Slug del contenido (ej: '2025-01-22-titulo-post')
 * @param availableLocales - Mapa de traducciones disponibles por idioma para este contenido
 * @returns Link con disponibilidad según traducciones, incluye razón si no está disponible
 */
export function buildDetailLink(targetLang: UILanguages, canonicalSection: string, availableLocales: AvailableLocales): TranslationLink {
  const entry = availableLocales[targetLang]
  const localizedSection = resolveLocalized(canonicalSection, targetLang)

  if (!entry) {
    return {
      href: '',
      label: languages[targetLang],
      isAvailable: false,
      disabledReason: 'missing'
    }
  }
  if (entry.draft) {
    return {
      href: `${buildLangPrefix(targetLang)}/${localizedSection}/${entry.slug}`,
      label: languages[targetLang],
      isAvailable: true,
      disabledReason: 'draft'
    }
  }

  return {
    href: `${buildLangPrefix(targetLang)}/${localizedSection}/${entry.slug}`,
    label: languages[targetLang],
    isAvailable: true
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
