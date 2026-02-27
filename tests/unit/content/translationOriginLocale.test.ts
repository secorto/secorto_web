import { describe, it, expect } from 'vitest'
import { sectionsConfig, type SectionConfig } from '@config/sections'
import { parseFrontmatter, getNested } from '@utils/frontmatter'

/**
 * Valida `translation_origin.locale` inspeccionando los archivos de contenido
 * mediante `import.meta.glob` (eager/raw) para integrarse mejor con Vite/Vitest.
 */
describe('content frontmatter: translation_origin.locale validity', () => {
  const modules = import.meta.glob('../../../src/content/**/**', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
  const sectionEntries = Object.entries(sectionsConfig) as Array<[keyof typeof sectionsConfig, SectionConfig]>

  for (const [sectionKey, cfg] of sectionEntries) {
    it(`${String(sectionKey)} - translation_origin.locale must be a valid route locale`, async () => {
      const allowedLocales = Object.keys(cfg.routes)
      const invalid: string[] = []

      for (const [filePath, raw] of Object.entries(modules)) {
        if (!filePath.includes(`/src/content/${String(sectionKey)}/`)) continue

        const fm = parseFrontmatter(raw)
        const localeVal = getNested<string>(fm, ['translation_origin', 'locale'])
        if (!localeVal) continue
        const fileName = filePath.split('/').pop() || filePath
        if (!allowedLocales.includes(localeVal)) {
          invalid.push(`${sectionKey}:${fileName} -> ${localeVal}`)
        }
      }

      if (invalid.length > 0) {
        throw new Error(`Found entries with invalid translation_origin.locale: ${invalid.join(', ')}`)
      }

      expect(invalid.length).toBe(0)
    })
  }
})
