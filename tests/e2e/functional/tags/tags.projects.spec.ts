import { test } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import { userInProjectList } from '@tests/support/pages/content/ProjectPages'

for (const locale of languageKeys) {
  test(`Tags - Project (${locale})`,
    {tag: ['@project', '@tags', `@${locale}`]},
    async ({ page }) => {
      const list = await userInProjectList(page, locale)
      await list.shouldRenderTagsForSection()
    })
}

