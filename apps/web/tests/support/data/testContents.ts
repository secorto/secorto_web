import { defaultLang, type UILanguages } from '@i18n/ui'
import type { SectionType } from '@domain/section'

export const testContents = [
  { name: 'blog', locale: 'es', testSlug: '2022-07-11-intro-python', testTag: 'python' },
  { name: 'blog', locale: 'en', testSlug: '2022-07-11-intro-python', testTag: 'python' },
  { name: 'talk', locale: 'es', testSlug: '2017-01-30-test-unitarios', testTag: 'python' },
  { name: 'talk', locale: 'en', testSlug: '2017-01-30-test-unitarios', testTag: 'python' },
  { name: 'work', locale: 'es', testSlug: 'perficient', testTag: 'dev' },
  { name: 'work', locale: 'en', testSlug: 'perficient', testTag: 'dev' },
  { name: 'projects', locale: 'es', testSlug: 'colombia-python', testTag: 'python' },
  { name: 'projects', locale: 'en', testSlug: 'colombia-python', testTag: 'python' },
  { name: 'community', locale: 'es', testSlug: 'pybaq', testTag: 'python' },
  { name: 'community', locale: 'en', testSlug: 'pybaq', testTag: 'python' },
] satisfies Array<{
  name: SectionType
  locale: UILanguages
  testSlug: string
  testTag: string
}>

/**
 * Filter the test contents based on the environment variable A11Y_ALL_LANGUAGES.
 * If A11Y_ALL_LANGUAGES is set to 'true', all test contents will be returned.
 * Otherwise, only the test contents matching the default language will be returned.
 */
export const a11yTestContents =
  process.env.A11Y_ALL_LANGUAGES === 'true'
    ? testContents
    : testContents.filter((content) => content.locale === defaultLang)
