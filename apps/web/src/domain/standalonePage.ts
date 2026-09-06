import { createStandalonePageRoutes } from '@secorto/i18n'
import { languages } from '@i18n/ui'

export const standalonePageRoutes = createStandalonePageRoutes(
  {
    about: {
      en: { route: 'about' },
      es: { route: 'acerca-de' },
    },
  },
  languages,
)
