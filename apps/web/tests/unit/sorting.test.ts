import { describe, it, expect } from 'vitest'
import {
  compareByPriorityAndDate,
  sortPostsByPriority,
  sortExperienceByPriority,
  getPriority,
} from '@utils/sorting'

function make(
  id: string,
  priority?: number,
  date?: string,
  startDate?: string,
) {
  return {
    id: `es/${id}`,
    data: {
      title: id,
      priority,
      date: date ? new Date(date) : undefined,
      startDate: startDate
        ? new Date(startDate)
        : undefined,
    },
  }
}

describe('getPriority', () => {
  it('returns the priority if defined', () => {
    const item = make('test', 5)

    expect(getPriority(item)).toBe(5)
  })

  it('returns 0 if priority is undefined', () => {
    const item = make('test')

    expect(getPriority(item)).toBe(0)
  })
})

describe('compareByPriorityAndDate', () => {
  it('orders by priority desc before falling back to date desc', () => {
    const a = make('a', 10, '2024-01-01')
    const b = make('b', 50, '2023-01-01')

    expect(
      compareByPriorityAndDate(
        a,
        b,
        item => item.data.date,
      ),
    ).toBeGreaterThan(0)
  })

  it('orders by date desc when priorities are equal', () => {
    const a = make('older', 10, '2023-01-01')
    const b = make('newer', 10, '2024-01-01')

    expect(
      compareByPriorityAndDate(
        a,
        b,
        item => item.data.date,
      ),
    ).toBeGreaterThan(0)
  })

  it('falls back to id when priority and date are equal', () => {
    const a = make('zeta', 10, '2024-01-01')
    const b = make('alpha', 10, '2024-01-01')

    expect(
      compareByPriorityAndDate(
        a,
        b,
        item => item.data.date,
      ),
    ).toBeGreaterThan(0)
  })

  it('treats invalid dates as missing', () => {
    const a = make('a', 10, 'not-a-date')
    const b = make('b', 10, '2024-01-01')

    expect(
      compareByPriorityAndDate(
        a,
        b,
        item => item.data.date,
      ),
    ).toBeGreaterThan(0)
  })
})

describe('post list sorting', () => {
  it('orders posts by priority and publication date desc', () => {
    const items = [
      make('older-post', 10, '2023-01-01'),
      make('newer-post', 10, '2024-01-01'),
      make('undated-post', 10),
    ]

    expect(
      sortPostsByPriority(items).map(s => s.id),
    ).toEqual([
      'es/newer-post',
      'es/older-post',
      'es/undated-post',
    ])
  })

  it('falls back to id when post priority and date are equal', () => {
    const items = [
      make('zeta', 10, '2024-01-01'),
      make('alpha', 10, '2024-01-01'),
      make('beta', 10, '2024-01-01'),
    ]

    expect(
      sortPostsByPriority(items).map(s => s.id),
    ).toEqual([
      'es/alpha',
      'es/beta',
      'es/zeta',
    ])
  })
})

describe('experience list sorting', () => {
  it('orders experiences by priority and startDate desc', () => {
    const items = [
      make('older-work', 10, undefined, '2023-01-01'),
      make('newer-work', 10, undefined, '2024-01-01'),
      make('undated-work', 10),
    ]

    expect(
      sortExperienceByPriority(items).map(s => s.id),
    ).toEqual([
      'es/newer-work',
      'es/older-work',
      'es/undated-work',
    ])
  })

  it('falls back to id when experience priority and startDate are equal', () => {
    const items = [
      make('work-zeta', 10, undefined, '2024-01-01'),
      make('work-alpha', 10, undefined, '2024-01-01'),
      make('work-beta', 10, undefined, '2024-01-01'),
    ]

    expect(
      sortExperienceByPriority(items).map(s => s.id),
    ).toEqual([
      'es/work-alpha',
      'es/work-beta',
      'es/work-zeta',
    ])
  })
})
