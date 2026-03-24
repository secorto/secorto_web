import type { UILanguages } from './ui'
import { languages, defaultLang, languageKeys } from './ui'
import { showDefaultLang } from '@i18n/config'
import { resolveLocalized, findCanonicalSectionKey, rootMap } from './rootMap'
import type { AvailableLocales } from '@domain/translation'

export interface TranslationLink {
  /** URL destino del link (puede ser string vacío si no está disponible) */
  href: string
  /** Etiqueta legible para el selector de idioma (p.ej. 'Español') */
  label: string
  /** Si la traducción/route está disponible para navegación */
  isAvailable: boolean
  /** Locale asociado a este link (clave de idioma) */
  locale: UILanguages
  /** Razón por la que no está disponible (cuando `isAvailable` es false) */
  disabledReason?: 'missing' | 'draft'
}

function availableLink(href: string, lang: UILanguages): TranslationLink {
  return { href, label: languages[lang], isAvailable: true, locale: lang }
}

function missingLink(lang: UILanguages): TranslationLink {
  return { href: '', label: languages[lang], isAvailable: false, disabledReason: 'missing', locale: lang }
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
  return availableLink(`${buildLangPrefix(targetLang)}/`, targetLang)
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
    return missingLink(targetLang)
  }
  const localizedSection = resolveLocalized(canonicalSection, targetLang)
  return {
    ...availableLink(`${buildLangPrefix(targetLang)}/${localizedSection}/tags/${slug}`, targetLang)
  }
}

/**
 * Construye un link de detalle usando directamente la sección localizada (sin pasar por el mapa canonical→localized).
 * Útil cuando el caller ya conoce la ruta localizada para cada idioma (por ejemplo desde `config.routes`).
 */
export function buildDetailLink(
  targetLang: UILanguages,
  localizedSection: string,
  availableLocales: AvailableLocales
): TranslationLink {
  const entry = availableLocales[targetLang]

  if (!entry) return missingLink(targetLang)

  const link = availableLink(`${buildLangPrefix(targetLang)}/${localizedSection}/${entry.slug}`, targetLang)
  if (entry.draft) return { ...link, disabledReason: 'draft' }
  return link
}

/**
 * Construye un link de language picker para índices de colecciones o páginas estáticas.
 * @param targetLang - Idioma destino para el link
 * @param canonicalSection - Sección canónica (ej: 'blog', 'about')
 * @returns Link disponible al índice de esa sección en ese idioma
 */
export function buildCollectionLink(targetLang: UILanguages, canonicalSection: string): TranslationLink {
  const localizedSection = resolveLocalized(canonicalSection, targetLang)
  return availableLink(`${buildLangPrefix(targetLang)}/${localizedSection}`, targetLang)
}

/**
 * Helper to build a full `Record<UILanguages, T>` of links using a builder callback.
 * Reduces repetition when creating language maps for the LanguagePicker.
 */
export function buildLanguageLinks<T extends TranslationLink>(builder: (l: UILanguages) => T): Record<UILanguages, T> {
  return Object.fromEntries(languageKeys.map(l => [l, builder(l)])) as Record<UILanguages, T>
}

/**
 * Build language links where every locale is intentionally unavailable.
 * Useful for routes that should show locked translation states (e.g. 404 pages).
 */
export function buildMissingLanguageLinks(): Record<UILanguages, TranslationLink> {
  return buildLanguageLinks(l => missingLink(l))
}

/**
 * Build a single language link for a static (non-collection) page.
 * Accepts `targetLang` to match the signature of other `build*Link` helpers.
 */
export function buildStaticPageLink(targetLang: UILanguages, url: URL): TranslationLink {
  const [, maybeLocale, rawSegment] = url.pathname.split('/')
  const isLocalePrefixed = (languageKeys as string[]).includes(maybeLocale)

  if (!isLocalePrefixed) return missingLink(targetLang)

  const currentLocale: UILanguages = maybeLocale as UILanguages
  const sectionKey = findCanonicalSectionKey(rawSegment, currentLocale)
  const sectionMap = rootMap[sectionKey]

  const localized = sectionMap && sectionMap[targetLang]
  if (localized) return availableLink(`${buildLangPrefix(targetLang)}/${localized}`, targetLang)

  if (targetLang === currentLocale) return availableLink(`${buildLangPrefix(targetLang)}/${rawSegment}`, targetLang)

  return missingLink(targetLang)
}

export function buildStaticPageLinks(url: URL): Record<UILanguages, TranslationLink> {
  return buildLanguageLinks(l => buildStaticPageLink(l, url))
}
