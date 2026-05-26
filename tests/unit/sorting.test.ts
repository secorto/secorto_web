import { describe, it, expect } from 'vitest'
import { sortByPriority } from '@utils/sorting'

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

describe('sortByPriority', () => {
  it('orders by priority desc', () => {
    const items = [make('a', 10), make('b', 50), make('c', 0)]
    const sorted = sortByPriority(items)
    expect(sorted.map(s => s.cleanId)).toEqual(['b', 'a', 'c'])
  })

  it('tiebreaks by startDate desc when priority equal', () => {
    const items = [make('a', 10, undefined, '2023-01-01'), make('b', 10, undefined, '2024-01-01'), make('c', 10)]
    const sorted = sortByPriority(items)
    expect(sorted.map(s => s.cleanId)).toEqual(['b', 'a', 'c'])
  })

  it('tiebreaks by date desc when priority equal', () => {
    const items = [make('a', 10, '2023-01-01'), make('b', 10, '2024-01-01'), make('c', 10)]
    const sorted = sortByPriority(items)
    expect(sorted.map(s => s.cleanId)).toEqual(['b', 'a', 'c'])
  })

  it('date has precedence over startDate when both present', () => {
    // a has later startDate but earlier date; b has later date -> b should come first
    const a = make('a', 10, '2023-01-01', '2025-01-01')
    const b = make('b', 10, '2024-01-01', '2010-01-01')
    const sorted = sortByPriority([a, b])
    expect(sorted.map(s => s.cleanId)).toEqual(['b', 'a'])
  })

  it('falls back to cleanId when no priority or date', () => {
    const items = [make('b'), make('a'), make('c')]
    const sorted = sortByPriority(items)
    expect(sorted.map(s => s.cleanId)).toEqual(['a', 'b', 'c'])
  })

  it('treats invalid Date objects as missing dates', () => {
    const a = make('a', 10, 'not-a-date') // invalid Date -> getTime() -> NaN
    const b = make('b', 10, undefined, '2024-01-01') // valid startDate
    const sorted = sortByPriority([a, b])
    // invalid date is treated like missing -> b (dated) should come first
    expect(sorted.map(s => s.cleanId)).toEqual(['b', 'a'])
  })

  it('does not mutate the input array (immutability)', () => {
    const items = [make('x', 5, '2020-01-01'), make('y', 10, '2021-01-01'), make('z', 0)]
    const originalOrder = items.map(i => i.cleanId)
    const copy = items.slice() // shallow copy reference

    const sorted = sortByPriority(items)

    // original array reference should remain same order
    expect(items.map(i => i.cleanId)).toEqual(originalOrder)
    // and the returned array is a different array instance
    expect(sorted).not.toBe(items)
    // sanity: returned array is ordered correctly
    expect(sorted.map(s => s.cleanId)).toEqual(['y', 'x', 'z'])
    // ensure shallow copy matches original (no mutation occurred)
    expect(copy.map(i => i.cleanId)).toEqual(originalOrder)
  })
})
