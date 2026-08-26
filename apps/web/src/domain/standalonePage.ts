import type { StandalonePageIndex } from '@secorto/i18n'
import type { UILanguages } from '@i18n/ui'

export const standalonePageIndex: StandalonePageIndex<
  string,
  UILanguages
> = {
  about: {
    en: { route: 'about' },
    es: { route: 'acerca-de' },
  },
}
