import { describe, it, expect } from 'vitest'
import { sectionsConfig, type SectionConfig } from '@config/sections'

/**
 * Valida `translation_origin.locale` inspeccionando los archivos de contenido
 * mediante `import.meta.glob` (eager/raw) para integrarse mejor con Vite/Vitest.
 */
describe('content frontmatter: translation_origin.locale validity (import.meta.glob)', () => {
  const modules = import.meta.glob('../../../src/content/**/**', { as: 'raw', eager: true }) as Record<string, string>
  const sectionEntries = Object.entries(sectionsConfig) as Array<[keyof typeof sectionsConfig, SectionConfig]>

  for (const [sectionKey, cfg] of sectionEntries) {
    it(`${String(sectionKey)} - translation_origin.locale must be a valid route locale`, async () => {
      const allowedLocales = Object.keys(cfg.routes)
      const invalid: string[] = []

      for (const [filePath, raw] of Object.entries(modules)) {
        if (!filePath.includes(`/src/content/${String(sectionKey)}/`)) continue

        const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/)
        if (!fmMatch) continue
        const fm = fmMatch[1]
        const toMatch = fm.match(/translation_origin:\s*\n([\s\S]*?)($|\n\w+:)/)
        if (!toMatch) continue
        const originBlock = toMatch[1]
        const localeMatch = originBlock.match(/locale:\s*['"]?([a-zA-Z0-9_-]+)['"]?/)
        if (!localeMatch) continue
        const localeVal = localeMatch[1]
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
