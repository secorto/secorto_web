/**
 * Tests del adapter: verifican que los adapters usan la sectionsConfig REAL
 * y que el wiring hacia el Core funciona correctamente.
 *
 * La lógica interna de paths (conteos, locales, tags) está cubierta en
 * staticPathsBuilder.test.ts. Aquí solo se prueba el contrato del adapter:
 * - Usa la config real (no un mock) → detecta si sectionsConfig cambia
 * - Acepta fetchCollection como inyectable
 * - Produce el shape esperado en los paths devueltos
 */
import { describe, test, expect, vi } from 'vitest'
import {
  buildSectionIndexPaths,
  buildTagPaths,
  buildAllDetailPaths,
  buildTagIndexPaths
} from '@utils/staticPathsBuilder.adapters'
import { sectionsConfig } from '@domain/section'
import { languageKeys } from '@i18n/ui'
import type { FetchCollection } from '@utils/staticPathsBuilder'

// La única dependencia externa real del adapter es astro:content (getCollection).
// Se mockea solo esa para no tocar red/FS; sectionsConfig se usa sin modificar.
vi.mock('astro:content', () => ({ getCollection: vi.fn(async () => []) }))

const sectionCount = Object.keys(sectionsConfig).length
const localeCount = languageKeys.length
const emptyFetch: FetchCollection = vi.fn(async () => [])

describe('staticPathsBuilder.adapters — contrato con sectionsConfig real', () => {
  test('buildSectionIndexPaths: genera paths para cada sección x locale', async () => {
    const result = await buildSectionIndexPaths(emptyFetch)

    expect(result).toHaveLength(sectionCount * localeCount)
    expect(result[0]).toMatchObject({ params: expect.objectContaining({ locale: expect.any(String), section: expect.any(String) }) })
  })

  test('buildTagIndexPaths: genera un path por locale con allSectionEntries cacheado', async () => {
    const result = await buildTagIndexPaths(emptyFetch)

    expect(result).toHaveLength(localeCount)
    const locales = result.map(p => p.params.locale).sort()
    expect(locales).toEqual([...languageKeys].sort())
    for (const path of result) {
      // Todas las secciones reales deben estar cacheadas en props
      for (const key of Object.keys(sectionsConfig)) {
        expect(path.props.allSectionEntries).toHaveProperty(key)
      }
    }
  })

  test('buildTagPaths: devuelve array (vacío si no hay entradas con tags)', async () => {
    const result = await buildTagPaths(emptyFetch)
    expect(Array.isArray(result)).toBe(true)
  })

  test('buildAllDetailPaths: devuelve array (vacío si no hay entradas)', async () => {
    const result = await buildAllDetailPaths(emptyFetch)
    expect(Array.isArray(result)).toBe(true)
  })
})
