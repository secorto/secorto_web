/**
 * This suite reproduces a specific invariant violation that was discovered in the `getStaticPathsEntries` function.
 * The violation occurs when the translation index resolves an empty sibling group for a given translation key.
 * This test ensures that the function throws an error in such cases, maintaining the integrity of the translation index.
 *
 * The invariant being tested is that a translation key should only be present in the index if it has at least one associated locale.
 * An empty group indicates a violation of this invariant, and the function should respond by throwing an error.
 */

import { describe, expect, it, vi } from 'vitest'

import * as translationIndexModule from '../../../src/section/translation-index'
import { getStaticPathsEntries } from '../../../src/astro/detail-path'
import {
  createLocales,
  createSectionRoutes,
  type GenericCollectionEntry,
} from '@secorto/i18n'

type Collection = 'blog' | 'talk'
type Entry = GenericCollectionEntry<Collection, { title: string }>

describe('getStaticPathsEntries invariant safety', () => {
  it('throws when the translation index resolves an empty sibling group', async () => {
    const routes = createSectionRoutes({
      blog: {
        es: 'blog/es',
        en: 'blog/en',
      },
      talk: {
        es: 'charla/es',
        en: 'talk/en',
      },
    })

    const locales = createLocales(['es', 'en'] as const)

    const fetchCollection = vi.fn(async (): Promise<Entry[]> => [
      {
        collection: 'blog',
        id: 'es/post-1',
        data: { title: 'Post ES' },
      },
    ])

    vi.spyOn(translationIndexModule, 'createTranslationIndex')
      .mockImplementationOnce(() => ({
        'post-1': {},
      } as never))

    await expect(
      getStaticPathsEntries(routes, fetchCollection, locales),
    ).rejects.toThrow(
      'Missing translation group for key "post-1"',
    )
  })
})
