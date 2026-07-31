import { z } from 'zod'
import { sectionsConfig, type SectionType } from '@domain/section'
import { languageKeys } from '@i18n/ui'

export const SectionTypeSchema = z.enum(
  Object.keys(sectionsConfig) as [SectionType, ...SectionType[]]
);

export const UILanguagesSchema = z.enum(languageKeys)

export const HighlightSchema = z.object({
  section: SectionTypeSchema,
  slug: z.string().min(1)
})

export const HomeFrontmatterSchema = z.object({
  title: z.string(),
  subTitle: z.string(),
  locale: UILanguagesSchema,
  highlights: z.array(HighlightSchema).min(1),
  draft: z.boolean().optional()
})

export type HomeFrontmatter = z.infer<typeof HomeFrontmatterSchema>

