import { describe, it, expect } from 'vitest'
import { sortByPriority, sortPostsByPriority, sortExperienceByPriority } from '@utils/sorting'

function make(id: string, priority?: number, date?: string, startDate?: string) {
  return {
    id: `es/${id}`,
    cleanId: id,
    data: {
      title: id,
      priority,
      date: date ? new Date(date) : undefined,
      startDate: startDate ? new Date(startDate) : undefined
    }
  }
}

describe('shared sorting behaviour', () => {
  it('sorts by priority desc', () => {
    const items = [make('a', 10), make('b', 50), make('c', 0)]
    expect(sortByPriority(items).map(s => s.cleanId)).toEqual(['b', 'a', 'c'])
  })

  it('sorts by date desc when priorities are equal', () => {
    const items = [
      make('older', 10, '2023-01-01'),
      make('newer', 10, '2024-01-01'),
      make('undated', 10)
    ]

    expect(sortByPriority(items).map(s => s.cleanId)).toEqual(['newer', 'older', 'undated'])
  })

  it('prefers date over startDate in the generic fallback', () => {
    const a = make('a', 10, '2023-01-01', '2025-01-01')
    const b = make('b', 10, '2024-01-01', '2010-01-01')
    expect(sortByPriority([a, b]).map(s => s.cleanId)).toEqual(['b', 'a'])
  })

  it('treats invalid dates as missing', () => {
    const a = make('a', 10, 'not-a-date')
    const b = make('b', 10, undefined, '2024-01-01')
    expect(sortByPriority([a, b]).map(s => s.cleanId)).toEqual(['b', 'a'])
  })

  it('falls back to cleanId when no priority or date is available', () => {
    const items = [make('b'), make('a'), make('c')]
    expect(sortByPriority(items).map(s => s.cleanId)).toEqual(['a', 'b', 'c'])
  })

  it('does not mutate the input array', () => {
    const items = [make('x', 5, '2020-01-01'), make('y', 10, '2021-01-01'), make('z', 0)]
    const originalOrder = items.map(i => i.cleanId)
    const copy = items.slice()

    const sorted = sortByPriority(items)

    expect(items.map(i => i.cleanId)).toEqual(originalOrder)
    expect(sorted).not.toBe(items)
    expect(sorted.map(s => s.cleanId)).toEqual(['y', 'x', 'z'])
    expect(copy.map(i => i.cleanId)).toEqual(originalOrder)
  })
})

describe('post list sorting', () => {
  it('orders posts by priority and publication date desc', () => {
    const items = [
      make('older-post', 10, '2023-01-01'),
      make('newer-post', 10, '2024-01-01'),
      make('undated-post', 10)
    ]

    expect(sortPostsByPriority(items).map(s => s.cleanId)).toEqual(['newer-post', 'older-post', 'undated-post'])
  })

  it('falls back to cleanId when post priority and date are equal', () => {
    const items = [
      make('zeta', 10, '2024-01-01'),
      make('alpha', 10, '2024-01-01'),
      make('beta', 10, '2024-01-01')
    ]

    expect(sortPostsByPriority(items).map(s => s.cleanId)).toEqual(['alpha', 'beta', 'zeta'])
  })
})

describe('experience list sorting', () => {
  it('orders experiences by priority and startDate desc', () => {
    const items = [
      make('older-work', 10, undefined, '2023-01-01'),
      make('newer-work', 10, undefined, '2024-01-01'),
      make('undated-work', 10)
    ]

    expect(sortExperienceByPriority(items).map(s => s.cleanId)).toEqual(['newer-work', 'older-work', 'undated-work'])
  })

  it('falls back to cleanId when experience priority and startDate are equal', () => {
    const items = [
      make('work-zeta', 10, undefined, '2024-01-01'),
      make('work-alpha', 10, undefined, '2024-01-01'),
      make('work-beta', 10, undefined, '2024-01-01')
    ]

    expect(sortExperienceByPriority(items).map(s => s.cleanId)).toEqual(['work-alpha', 'work-beta', 'work-zeta'])
  })
})
