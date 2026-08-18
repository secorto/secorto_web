import { defaultLang, languageKeys, type UILanguages } from '@i18n/ui'

export const enabledA11yLanguages: UILanguages[] =
  process.env.A11Y_ALL_LANGUAGES === 'true'
    ? [...languageKeys]
    : [defaultLang]
