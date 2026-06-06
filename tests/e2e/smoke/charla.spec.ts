import { test } from '@tests/fixtures'
import { languageKeys, ui, type UILanguages } from '@i18n/ui'
import { userInTalkList, userInTalkDetail } from '@tests/support/pages/content/TalkPages'
import { contentListPath, contentDetailsPath } from '@tests/support/pages/shared/NavigationPaths'
import { pageHelper } from '@tests/support/pages/components/PageHelper'

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const SLUG = '2023-09-27-devcontainers'

const expectedTitles: Record<UILanguages, string> = {
  es: 'Devcontainers en localhost',
  en: 'Devcontainers on localhost',
}

const expectedTags: Record<UILanguages, string> = {
  es: `
    - link "python":
      - /url: /es/charla/tags/python
      - paragraph: python
    - link "containers":
      - /url: /es/charla/tags/containers
      - paragraph: containers
  `,
  en: `
    - link "python":
      - /url: /en/talk/tags/python
      - paragraph: python
    - link "containers":
      - /url: /en/talk/tags/containers
      - paragraph: containers
  `,
}

test.describe('Charlas', { tag: ['@smoke', '@talk'] }, () => {
  for (const locale of languageKeys) {
    test(`talk list shows title (${locale})`, { tag: [`@${locale}`] }, async ({ page }) => {
      const list = await userInTalkList(page, locale)
      const listPath = contentListPath('talk', locale)
      const expectedHeaderTitle = ui[locale]['nav.talks']

      await pageHelper(page).shouldHaveURL(listPath)
      await pageHelper(page).shouldHaveTitle(new RegExp(`^${escapeRegExp(expectedHeaderTitle)} \\| SeCOrTo$`))
      await list.shouldHaveListHeaderTitle(expectedHeaderTitle)
    })

    test(`talk detail shows title and tags (${locale})`, { tag: [`@${locale}`] }, async ({ page }) => {
      const detail = await userInTalkDetail(page, locale, SLUG)
      await pageHelper(page).shouldHaveURL(contentDetailsPath('talk', locale, SLUG))
      await detail.shouldHaveDetailTitle(expectedTitles[locale])
      await detail.shouldHaveTags(expectedTags[locale])
    })

    test(`talk detail has comments (${locale})`, { tag: [`@${locale}`] }, async ({ page }) => {
      const detail = await userInTalkDetail(page, locale, SLUG)
      await detail.shouldHaveComments(locale)
    })
  }
})
