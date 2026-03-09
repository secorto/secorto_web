import type { UILanguages } from './ui'
import { languages, defaultLang, showDefaultLang } from './ui'
import { resolveLocalized } from './rootMap'
import * as translationsModule from './translations'
import type { TranslationEntry } from '@i18n/buildTranslationMap'

type SeriesByKey = Record<string, Record<string, TranslationEntry>>
type TranslationStructures = Record<string, { seriesByKey: SeriesByKey; slugIndex: Record<string, string> }>

const translations = (translationsModule as unknown as { translations: Record<string, Record<string, unknown>> }).translations
const translationStructures = (translationsModule as unknown as { translationStructures?: TranslationStructures }).translationStructures

interface EntryMeta {
  noTranslate?: string[]
}

export type AvailableLocales = Partial<Record<UILanguages, { slug: string }>>

export interface TranslationLink {
  href: string
  label: string
  title?: string
  aria?: string
  isAvailable: boolean
  disabledReason?: 'not-available' | 'no-translate'
  marker?: string
}

/**
 * Configuración de razones por las que un idioma no tiene traducción disponible.
 * Define el marcador visual (emoji) y mensaje para cada caso.
 */
export const DISABLED_REASON_CONFIG: Record<'not-available' | 'no-translate', {
  marker: string
  title: string
}> = {
  'not-available': {
    marker: '⌛',
    title: 'La traducción no está disponible todavía'
  },
  'no-translate': {
    marker: '🔒',
    title: 'Esta publicación no será traducida'
  }
}

function buildLangPrefix(targetLang: UILanguages): string {
  return targetLang === defaultLang && !showDefaultLang ? "" : `/${targetLang}`
}

function getDisabledReasonForLang(targetLang: UILanguages, slug: string, canonicalSection: string): 'not-available' | 'no-translate' {
  // Two possible reasons:
  // - 'no-translate': the entry is explicitly marked as not translatable for targetLang
  // - 'not-available': no translation exists (or the series/slug doesn't exist)

  // Check legacy per-slug metadata (kept for backward compatibility)
  const meta = translations[canonicalSection as keyof typeof translations]?.[slug] as EntryMeta | undefined
  if (Array.isArray(meta?.noTranslate) && meta!.noTranslate!.includes(targetLang)) {
    return 'no-translate'
  }

  // Otherwise, the translation is simply not available
  return 'not-available'
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
export function buildTagLink(targetLang: UILanguages, canonicalSection: string, slug: string): TranslationLink {
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
export function buildDetailLink(targetLang: UILanguages, canonicalSection: string, slug: string, availableLocales: AvailableLocales): TranslationLink {
  const entry = availableLocales[targetLang]
  const localizedSection = resolveLocalized(canonicalSection, targetLang)

  if (!entry) {
    const disabledReason = getDisabledReasonForLang(targetLang, slug, canonicalSection)
    const config = DISABLED_REASON_CONFIG[disabledReason]

    return {
      href: '',
      label: languages[targetLang],
      isAvailable: false,
      disabledReason,
      marker: config.marker,
      title: config.title,
      aria: `${config.title}: ${languages[targetLang]}`
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
