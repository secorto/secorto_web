import { describe, expect, test } from 'vitest'
import { buildGlobalTagGroups } from '@domain/tags'
import type { TagGroupSectionInput } from '@domain/tags'

describe('buildGlobalTagGroups', () => {
  test('groups tags globally and deduplicates section references', () => {
    const sections: TagGroupSectionInput[] = [
      {
        section: 'blog',
        sectionSlug: 'blog',
        sectionLabel: 'Blog',
        entries: [
          { data: { tags: ['python', 'tools'] } },
          { data: { tags: ['python'] } },
        ]
      },
      {
        section: 'talk',
        sectionSlug: 'talk',
        sectionLabel: 'Talks',
        entries: [
          { data: { tags: ['python'] } },
        ]
      }
    ]

    const groups = buildGlobalTagGroups('en', sections)

    const python = groups.find(group => group.canonicalTag === 'python')
    expect(python).toBeDefined()
    expect(python?.references).toHaveLength(2)
    expect(python?.references.map(reference => reference.section)).toEqual(['blog', 'talk'])
  })

  test('normalizes translated tags to canonical key and localizes output slug', () => {
    const sections: TagGroupSectionInput[] = [
      {
        section: 'blog',
        sectionSlug: 'blog',
        sectionLabel: 'Blog',
        entries: [
          { data: { tags: ['herramientas'] } }
        ]
      }
    ]

    const groups = buildGlobalTagGroups('es', sections)

    expect(groups).toHaveLength(1)
    expect(groups[0].canonicalTag).toBe('tools')
    expect(groups[0].localizedTag).toBe('herramientas')
    expect(groups[0].references[0].tagSlug).toBe('herramientas')
  })

  test('sorts references by section label and groups by localized tag', () => {
    const sections: TagGroupSectionInput[] = [
      {
        section: 'talk',
        sectionSlug: 'talk',
        sectionLabel: 'Talks',
        entries: [
          { data: { tags: ['python'] } }
        ]
      },
      {
        section: 'blog',
        sectionSlug: 'blog',
        sectionLabel: 'Blog',
        entries: [
          { data: { tags: ['python', 'astro'] } }
        ]
      }
    ]

    const groups = buildGlobalTagGroups('en', sections)

    expect(groups.map(group => group.localizedTag)).toEqual(['astro', 'python'])
    expect(groups[1].references.map(reference => reference.sectionLabel)).toEqual(['Blog', 'Talks'])
  })

  test('returns empty array when there are no tags', () => {
    const sections: TagGroupSectionInput[] = [
      {
        section: 'blog',
        sectionSlug: 'blog',
        sectionLabel: 'Blog',
        entries: [
          { data: {} }
        ]
      }
    ]

    expect(buildGlobalTagGroups('en', sections)).toEqual([])
  })
})
