import { z } from 'zod'
import { sectionRoutes } from '@domain/section'
import { languages } from '@i18n/ui'

export const SectionTypeSchema = z.enum(sectionRoutes.getSections())

export const UILanguagesSchema = z.enum(languages.all)

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

