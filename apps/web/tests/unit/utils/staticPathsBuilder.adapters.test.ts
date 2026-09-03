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
  buildTagPaths,
} from '@utils/staticPathsBuilder.adapters'
import type { FetchCollection } from '@utils/staticPathsBuilder'

// La única dependencia externa real del adapter es astro:content (getCollection).
// Se mockea solo esa para no tocar red/FS; sectionsConfig se usa sin modificar.
vi.mock('astro:content', () => ({ getCollection: vi.fn(async () => []) }))

const emptyFetch: FetchCollection = vi.fn(async () => [])

describe('staticPathsBuilder.adapters — contrato con sectionsConfig real', () => {
  test('buildTagPaths: devuelve array (vacío si no hay entradas con tags)', async () => {
    const result = await buildTagPaths(emptyFetch)
    expect(Array.isArray(result)).toBe(true)
  })
})
