import { test } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import { userInContentDetail } from '@tests/support/ui/shared/flows/a11yNavigate'
import type { SectionType } from '@domain/section';

const testContents = [
  { name: 'blog', locale: 'es', testSlug: '2022-07-11-intro-python' },
  { name: 'blog', locale: 'en', testSlug: '2022-07-11-intro-python' },
  { name: 'talk', locale: 'es', testSlug: '2017-01-30-test-unitarios' },
  { name: 'talk', locale: 'en', testSlug: '2017-01-30-test-unitarios' },
  { name: 'work', locale: 'es', testSlug: 'perficient' },
  { name: 'work', locale: 'en', testSlug: 'perficient' },
  { name: 'projects', locale: 'es', testSlug: 'colombia-python' },
  { name: 'projects', locale: 'en', testSlug: 'colombia-python' },
  { name: 'community', locale: 'es', testSlug: 'pybaq' },
  { name: 'community', locale: 'en', testSlug: 'pybaq' },
] satisfies Array<{ name: SectionType; locale: typeof languageKeys[number]; testSlug: string }>

testContents.forEach((content) => {
  test.describe(`@a11y @content-${content.name} @${content.locale}`, () => {
    test(`@content-details @${content.testSlug}`, async ({ page }) => {
      const detailA11yFlow = await userInContentDetail(page, content.locale, content.name, content.testSlug)
      await detailA11yFlow.audit()
    })
  })
})
