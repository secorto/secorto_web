import { languages } from '@i18n/ui'
import { createSectionRoutes } from '@secorto/i18n'

export const sectionRoutes = createSectionRoutes({
  blog: { es: 'blog', en: 'blog' },
  talk: { es: 'charla', en: 'talk' },
  work: { es: 'trabajo', en: 'work' },
  projects: { es: 'proyecto', en: 'project' },
  community: { es: 'comunidad', en: 'community' },
}, languages)

const sectionList = sectionRoutes.getSections()

export type SectionType = typeof sectionList[number]

export const navSections = [
  'talk',
  'blog',
  'work',
  'community',
  'projects',
] as const satisfies readonly SectionType[]
