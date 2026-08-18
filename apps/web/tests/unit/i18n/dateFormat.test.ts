import { describe, it, expect } from 'vitest'
import { full, monthYear } from '@i18n/dateFormat'

describe('dateFormat', () => {
  it('full has dateStyle "full" and UTC timezone', () => {
    expect(full.dateStyle).toBe('full')
    expect(full.timeZone).toBe('UTC')
  })

  it('monthYear has month "long", year "numeric" and UTC timezone', () => {
    expect(monthYear.month).toBe('long')
    expect(monthYear.year).toBe('numeric')
    expect(monthYear.timeZone).toBe('UTC')
  })

  it('formats a date correctly with full options', () => {
    const date = new Date('2025-06-15T00:00:00Z')
    const formatted = new Intl.DateTimeFormat('es', full).format(date)
    expect(formatted).toContain('2025')
    expect(formatted.toLowerCase()).toContain('junio')
  })

  it('formats a date correctly with monthYear options', () => {
    const date = new Date('2025-06-15T00:00:00Z')
    const formatted = new Intl.DateTimeFormat('en', monthYear).format(date)
    expect(formatted).toContain('June')
    expect(formatted).toContain('2025')
  })
})
