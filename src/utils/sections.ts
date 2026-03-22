import type { UILanguages } from '@i18n/ui'
import type { CollectionKey } from 'astro:content'
import { sectionsConfig, type SectionConfig, type SectionType } from '@domain/section'


/**
 * Helper interno que busca una `SectionConfig` que cumpla un predicado.
 * @param predicate - función que recibe una `SectionConfig` y retorna boolean
 */
function findSectionConfig(predicate: (c: SectionConfig) => boolean): SectionConfig {
  for (const config of Object.values(sectionsConfig)) {
    if (predicate(config)) return config
  }
  throw new Error('Section config not found')
}

/**
 * Obtiene la configuración de una sección basada en la ruta URL
 */
export function getSectionConfigByRoute(
  routeParam: string,
  locale: UILanguages
): SectionConfig {
  return findSectionConfig((config) => config.routes[locale] === routeParam)
}

/**
 * Obtiene la configuración de una sección basada en la clave de colección
 */
export function getSectionConfigByCollection(
  collection: CollectionKey
): SectionConfig {
  return findSectionConfig((config) => config.name === collection)
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
