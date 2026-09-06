import { sectionRoutes } from '@domain/section'
import { languages } from '@i18n/ui'
import { createTagRoutes } from '@secorto/i18n'

export const tagRoutes = createTagRoutes(
  sectionRoutes,
  { en: 'tags', es: 'tags' },
  {
    containers: {en: 'containers', es: 'containers'},
    dev: { en: 'dev', es: 'desarrollo' },
    frontend: { en: 'frontend', es: 'frontend' },
    gis: { en: 'gis', es: 'gis' },
    jamstack: { en: 'jamstack', es: 'jamstack' },
    java: { en: 'java', es: 'java' },
    javascript: { en: 'javascript', es: 'javascript' },
    linux: { en: 'linux', es: 'linux' },
    opensource: { en: 'opensource', es: 'codigo-abierto' },
    python: { en: 'python', es: 'python' },
    testing: { en: 'testing', es: 'pruebas' },
  },
  languages,
)

export type Tag = ReturnType<typeof tagRoutes.getTags>[number]
