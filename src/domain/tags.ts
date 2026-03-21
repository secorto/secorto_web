import type { UILanguages } from '@i18n/ui'
import type { SectionType } from '@domain/section'

/**
 * Mapa de traducción de tags: canónico → { idioma → slug }
 * La clave canónica es arbitraria (usamos inglés por convención).
 */
export type TagMap = Record<string, Partial<Record<UILanguages, string>>>

/**
 * Mapa global de traducciones de tags.
 * Solo declara tags cuyo slug varía según el idioma — tags que son iguales
 * en todos los idiomas (ej: 'python', 'linux') no necesitan entrada aquí.
 */
export const tagTranslations: TagMap = {
  tools: { en: 'tools', es: 'herramientas' },
  games: { en: 'games', es: 'juegos' },
}

export interface TaggableEntry {
  data: {
    /** Array opcional de tags asociados a esta entrada */
    tags?: string[]
  }
}

export interface TagGroupSectionInput {
  /** Tipo de sección (blog, charla, trabajo, etc.) */
  section: SectionType
  /** Slug de la URL para esta sección */
  sectionSlug: string
  /** Etiqueta de traducción o nombre legible de la sección */
  sectionLabel: string
  /** Entries de la sección que contienen los tags */
  entries: TaggableEntry[]
}

export interface TagSectionReference {
  /** Tipo de sección que contiene este tag */
  section: SectionType
  /** Slug de la URL para esta sección */
  sectionSlug: string
  /** Etiqueta de traducción o nombre legible de la sección */
  sectionLabel: string
  /** Slug del tag localizado para esta sección */
  tagSlug: string
}

export interface TagGroup {
  /** Tag en forma canónica (clave en inglés) */
  canonicalTag: string
  /** Tag localizado para el idioma actual */
  localizedTag: string
  /** Referencias a secciones que contienen este tag */
  references: TagSectionReference[]
}

/**
 * Convierte un tag localizado o canónico a su forma canónica.
 * Tags que no están en tagTranslations se retornan sin cambios.
 * @param tag - El tag a convertir (puede ser localizado o canónico)
 * @param lang - El contexto de idioma para la búsqueda de traducción
 * @returns El tag canónico (forma en inglés)
 */
export function getCanonicalTag(tag: string, lang: UILanguages): string {
  const mappedTag = Object.entries(tagTranslations).find(([, locales]) => locales[lang] === tag)
  return mappedTag?.[0] ?? tag
}

/**
 * Convierte un tag canónico a su forma localizada para un idioma dado.
 * @param canonicalTag - El tag canónico (base) a localizar
 * @param lang - El idioma destino para la localización
 * @returns El tag localizado, o el tag canónico si no existe traducción
 */
export function getLocalizedTag(canonicalTag: string, lang: UILanguages): string {
  return tagTranslations[canonicalTag]?.[lang] ?? canonicalTag
}

/**
 * Procesa un tag individual y lo agrega al mapa agrupado, eliminando referencias duplicadas por sección.
 * @param groupedTags - Mapa acumulativo de tags agrupados
 * @param locale - Contexto de idioma para convertir a forma canónica
 * @param tag - El tag a procesar (puede ser localizado o canónico)
 * @param section - La sección que contiene este tag
 */
function addTagReference(
  groupedTags: Map<string, { localizedTag: string; references: Map<SectionType, TagSectionReference> }>,
  locale: UILanguages,
  tag: string,
  section: TagGroupSectionInput
): void {
  const canonicalTag = getCanonicalTag(tag, locale)
  const localizedTag = getLocalizedTag(canonicalTag, locale)

  const current = groupedTags.get(canonicalTag) ?? {
    localizedTag,
    references: new Map<SectionType, TagSectionReference>()
  }

  if (!current.references.has(section.section)) {
    current.references.set(section.section, {
      section: section.section,
      sectionSlug: section.sectionSlug,
      sectionLabel: section.sectionLabel,
      tagSlug: localizedTag
    })
  }

  groupedTags.set(canonicalTag, current)
}

/**
 * Convierte el mapa agrupado en un array de TagGroup ordenado.
 * Ordena referencias por etiqueta de sección y grupos por nombre de tag localizado.
 * @param groupedTags - Mapa de tags agrupados con sus referencias
 * @returns Array de grupos de tags ordenado para presentación
 */
function formatTagGroups(
  groupedTags: Map<string, { localizedTag: string; references: Map<SectionType, TagSectionReference> }>
): TagGroup[] {
  return Array.from(groupedTags.entries())
    .map(([canonicalTag, group]) => ({
      canonicalTag,
      localizedTag: group.localizedTag,
      references: Array.from(group.references.values())
        .sort((a, b) => a.sectionLabel.localeCompare(b.sectionLabel))
    }))
    .sort((a, b) => a.localizedTag.localeCompare(b.localizedTag))
}

/**
 * Agrupa todos los tags globalmente a través de múltiples secciones y elimina referencias duplicadas.
 * Los tags se normalizan a su forma canónica y se localizan para la salida.
 * Los resultados se ordenan por nombre de tag localizado con referencias ordenadas por etiqueta de sección.
 * @param locale - El contexto de idioma para la localización de tags
 * @param sections - Array de secciones que contienen entries con tags
 * @returns Array de grupos de tags ordenado por nombre de tag localizado
 */
export function buildGlobalTagGroups(
  locale: UILanguages,
  sections: TagGroupSectionInput[]
): TagGroup[] {
  const groupedTags = new Map<string, { localizedTag: string; references: Map<SectionType, TagSectionReference> }>()

  for (const section of sections) {
    for (const entry of section.entries) {
      const tags = entry.data.tags ?? []
      for (const tag of tags) {
        addTagReference(groupedTags, locale, tag, section)
      }
    }
  }

  return formatTagGroups(groupedTags)
}
