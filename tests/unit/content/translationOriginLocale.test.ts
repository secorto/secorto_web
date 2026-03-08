import { describe, it, expect } from 'vitest'
import { sectionsConfig, type SectionConfig } from '@domain/section'
import { parseFrontmatter } from '@utils/frontmatter'

/**
 * Valida `translation_origin.locale` inspeccionando los archivos de contenido
 * mediante `import.meta.glob` (eager/raw) para integrarse mejor con Vite/Vitest.
 */
describe('content frontmatter: translation_origin.locale validity', () => {
  const modules = import.meta.glob('../../../src/content/**/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
  const sectionEntries = Object.entries(sectionsConfig) as Array<[keyof typeof sectionsConfig, SectionConfig]>

  for (const [sectionKey, cfg] of sectionEntries) {
    it(`${String(sectionKey)} - translation_origin.locale must be a valid route locale`, () => {
      const allowedLocales = Object.keys(cfg.routes)
      const sectionFiles = Object.entries(modules).filter(([filePath]) =>
        filePath.includes(`/src/content/${String(sectionKey)}/`)
      )

      for (const [filePath, raw] of sectionFiles) {
        const fm = parseFrontmatter(raw)
        if (typeof fm !== 'object' || fm === null) continue
        const obj = fm as Record<string, unknown>
        const originRaw = obj.translation_origin
        if (!originRaw || typeof originRaw !== 'object') continue
        const origin = originRaw as Record<string, string>
        const fileName = filePath.split('/').pop() || filePath
        expect(allowedLocales, `${sectionKey}:${fileName} has invalid translation_origin.locale "${origin.locale}"`).toContain(origin.locale)
      }
    })
  }
})
