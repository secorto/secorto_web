import { test } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import { userInContentTag } from '@tests/support/ui/shared/flows/a11yNavigate'
import type { SectionType } from '@domain/section';

const testContents = [
  { name: 'blog', locale: 'es', testTag: 'python' },
  { name: 'blog', locale: 'en', testTag: 'python' },
  { name: 'talk', locale: 'es', testTag: 'python' },
  { name: 'talk', locale: 'en', testTag: 'python' },
  { name: 'work', locale: 'es', testTag: 'dev' },
  { name: 'work', locale: 'en', testTag: 'dev' },
  { name: 'projects', locale: 'es', testTag: 'python' },
  { name: 'projects', locale: 'en', testTag: 'python' },
  { name: 'community', locale: 'es', testTag: 'python' },
  { name: 'community', locale: 'en', testTag: 'python' },
] satisfies Array<{ name: SectionType; locale: typeof languageKeys[number]; testTag: string }>

testContents.forEach((content) => {
  test.describe(`@a11y @content-${content.name} @${content.locale}`, () => {
    test(`@content-tags @${content.testTag}`, async ({ page }) => {
      const tagA11yFlow = await userInContentTag(page, content.locale, content.name, content.testTag)
      await tagA11yFlow.audit()
    })
  })
})
