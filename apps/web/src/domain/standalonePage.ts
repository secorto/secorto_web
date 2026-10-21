import { createStandalonePageRoutes } from '@secorto/i18n'
import { languages } from '@i18n/ui'

export const standalonePageRoutes = createStandalonePageRoutes(
  {
    about: {
      en: { slug: 'about' },
      es: { slug: 'acerca-de' },
    },
    architecture: {
      en: { slug: 'architecture' },
      es: { slug: 'arquitectura' },
    },
    'testing-foundation': {
      en: { slug: 'testing-foundation' },
      es: { slug: 'testing-foundation' },
    },
  },
  languages,
)
