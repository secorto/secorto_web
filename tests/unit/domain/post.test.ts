import { describe, expect, test } from 'vitest'
import { formatDateRange, getSeoDescription } from '@domain/post'

const fmt = (d: Date) => d.toISOString().slice(0, 7) // "YYYY-MM"

describe('formatDateRange', () => {
  test('devuelve null cuando no hay startDate', () => {
    expect(formatDateRange(undefined, undefined, fmt, 'hoy')).toBeNull()
    expect(formatDateRange(undefined, new Date('2024-01-01'), fmt, 'hoy')).toBeNull()
  })

  test('usa el todayLabel cuando no hay endDate', () => {
    const result = formatDateRange(new Date('2022-03-01'), undefined, fmt, 'actualidad')
    expect(result).toBe('2022-03 - actualidad')
  })

  test('muestra el rango completo cuando hay startDate y endDate', () => {
    const result = formatDateRange(new Date('2020-06-01'), new Date('2023-12-01'), fmt, 'hoy')
    expect(result).toBe('2020-06 - 2023-12')
  })

  test('aplica la función de formato a ambas fechas', () => {
    const upper = (d: Date) => d.getUTCFullYear().toString()
    const result = formatDateRange(new Date('2019-01-01'), new Date('2021-01-01'), upper, 'hoy')
    expect(result).toBe('2019 - 2021')
  })
})

describe('getSeoDescription', () => {
  test('usa excerpt cuando está presente', () => {
    const entry = { data: { excerpt: 'resumen', description: 'desc' } }
    expect(getSeoDescription(entry.data)).toBe('resumen')
  })

  test('cae a description cuando excerpt es falsy', () => {
    const entry = { data: { excerpt: '', description: 'desc disponible' } }
    expect(getSeoDescription(entry.data)).toBe('desc disponible')
  })

  test('devuelve cadena vacía si no hay datos', () => {
    const entry = { data: {} }
    expect(getSeoDescription(entry.data)).toBe('')
  })
})
