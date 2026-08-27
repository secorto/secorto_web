import { it, expect, describe, vi } from 'vitest'

import { createSectionRoutes, getStaticPathsEntries, type GenericCollectionEntry } from '@secorto/i18n'
import { createLocales } from '@secorto/i18n'

describe('getStaticPathsEntries', () => {
  const routes = createSectionRoutes({
    blog: { es: 'blog/es', en: 'blog/en' },
    talk: { es: 'charla/es', en: 'talk/en' }
  })

  const allowedLocales = createLocales(['es', 'en'] as const)

  const rawBlog: GenericCollectionEntry<'blog', { title: string }>[] = [
    { collection: 'blog', id: 'es/post-1', data: { title: 'Post ES' } },
    { collection: 'blog', id: 'en/post-1', data: { title: 'Post EN' } }
  ]

  const rawTalk: GenericCollectionEntry<'talk', { title: string }>[] = [
    { collection: 'talk', id: 'es/talk-1', data: { title: 'Charla ES' } },
    { collection: 'talk', id: 'en/talk-1', data: { title: 'Talk EN' } }
  ]

  const fetchCollection = vi.fn(async (collection: 'blog' | 'talk'): Promise<GenericCollectionEntry<'blog' | 'talk', { title: string }>[]> => {
    if (collection === 'blog') return rawBlog
    if (collection === 'talk') return rawTalk
    return []
  })

  type Entry =
  GenericCollectionEntry<
    'blog' | 'talk',
    { title: string }
  >

  let result: Awaited<
    ReturnType<
      typeof getStaticPathsEntries<
        Entry,
        { title: string },
        'blog' | 'talk',
        'es' | 'en'
      >
    >
  >

  it('executes getStaticPathsEntries', async () => {
    result = await getStaticPathsEntries(routes, fetchCollection, allowedLocales)
    expect(result.length).toBe(4)
  })

  it('generates correct params for blog/es', () => {
    const blogEs = result.find(p => p.params.section === 'blog' && p.params.locale === 'es')
    expect(blogEs?.params).toEqual({
      locale: 'es',
      section: 'blog',
      id: 'post-1'
    })
  })

  it('generates correct params for blog/en', () => {
    const blogEn = result.find(p => p.params.section === 'blog' && p.params.locale === 'en')
    expect(blogEn?.params).toEqual({
      locale: 'en',
      section: 'blog',
      id: 'post-1'
    })
  })

  it('generates correct siblings for blog', () => {
    const blogEs = result.find(p => p.params.section === 'blog' && p.params.locale === 'es')
    expect(Object.keys(blogEs!.props.siblings)).toEqual(['es', 'en'])
    expect(blogEs!.props.siblings.es?.original.data.title).toBe('Post ES')
    expect(blogEs!.props.siblings.en?.original.data.title).toBe('Post EN')
  })

  it('generates correct params for talk/es', () => {
    const talkEs = result.find(p => p.params.section === 'talk' && p.params.locale === 'es')
    expect(talkEs?.params).toEqual({
      locale: 'es',
      section: 'talk',
      id: 'talk-1'
    })
  })

  it('generates correct params for talk/en', () => {
    const talkEn = result.find(p => p.params.section === 'talk' && p.params.locale === 'en')
    expect(talkEn?.params).toEqual({
      locale: 'en',
      section: 'talk',
      id: 'talk-1'
    })
  })

  it('generates correct siblings for talk', () => {
    const talkEs = result.find(p => p.params.section === 'talk' && p.params.locale === 'es')
    expect(Object.keys(talkEs!.props.siblings)).toEqual(['es', 'en'])
    expect(talkEs!.props.siblings.es?.original.data.title).toBe('Charla ES')
    expect(talkEs!.props.siblings.en?.original.data.title).toBe('Talk EN')
  })

  it('calls fetchCollection for both collections', () => {
    expect(fetchCollection).toHaveBeenCalledWith('blog')
    expect(fetchCollection).toHaveBeenCalledWith('talk')
    expect(fetchCollection).toHaveBeenCalledTimes(2)
  })
})