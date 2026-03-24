import type { UILanguages } from './ui'
import type { TranslationLink } from '@domain/translationLink'
import { languages, defaultLang, languageKeys } from './ui'
import { showDefaultLang } from '@i18n/config'
import { resolveLocalized, findCanonicalSectionKey, rootMap } from './rootMap'
import type { AvailableLocales } from '@domain/translation'


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

/**
 * Construye `alternates` (lista de objetos `{ locale, url }`) a partir
 * de un mapa `links` del language picker, filtrando los que no están disponibles.
 */
export function buildAlternatesFromLinks<T extends TranslationLink>(links: Record<UILanguages, T>) {
  return Object.values(links)
    .filter(l => Boolean(l.isAvailable) && Boolean(l.href))
    .map(l => ({ locale: l.locale, url: l.href }))
}
