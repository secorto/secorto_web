import type { UILanguages } from '@i18n/ui'
import type { SectionType } from '@domain/section'

/**
 * canonical → { locale → url-slug }
 * The canonical key is arbitrary (we use English by convention).
 */
export type TagMap = Record<string, Partial<Record<UILanguages, string>>>

/**
 * Global tag translation map.
 * Only declare tags whose slug differs across locales — tags that are the same
 * in every locale (e.g. 'python', 'linux') don't need an entry here.
 */
export const tagTranslations: TagMap = {
  tools: { en: 'tools', es: 'herramientas' },
  games: { en: 'games', es: 'juegos' },
}

export interface TaggableEntry {
  data: {
    tags?: string[]
  }
}

export interface TagGroupSectionInput {
  section: SectionType
  sectionSlug: string
  sectionLabel: string
  entries: TaggableEntry[]
}

export interface TagSectionReference {
  section: SectionType
  sectionSlug: string
  sectionLabel: string
  tagSlug: string
}

export interface TagGroup {
  canonicalTag: string
  localizedTag: string
  references: TagSectionReference[]
}

export function getCanonicalTag(tag: string, lang: UILanguages): string {
  const mappedTag = Object.entries(tagTranslations).find(([, locales]) => locales[lang] === tag)
  return mappedTag?.[0] ?? tag
}

export function getLocalizedTag(canonicalTag: string, lang: UILanguages): string {
  return tagTranslations[canonicalTag]?.[lang] ?? canonicalTag
}

export function buildGlobalTagGroups(
  locale: UILanguages,
  sections: TagGroupSectionInput[]
): TagGroup[] {
  const groupedTags = new Map<string, { localizedTag: string; references: Map<SectionType, TagSectionReference> }>()

  for (const section of sections) {
    for (const entry of section.entries) {
      const tags = entry.data.tags ?? []
      for (const tag of tags) {
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
    }
  }

  return Array.from(groupedTags.entries())
    .map(([canonicalTag, group]) => ({
      canonicalTag,
      localizedTag: group.localizedTag,
      references: Array.from(group.references.values())
        .sort((a, b) => a.sectionLabel.localeCompare(b.sectionLabel))
    }))
    .sort((a, b) => a.localizedTag.localeCompare(b.localizedTag))
}
