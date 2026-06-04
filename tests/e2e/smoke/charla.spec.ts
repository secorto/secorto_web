import { test } from '@tests/fixtures'
import { languageKeys, type UILanguages } from '@i18n/ui'
import { userInTalkList, userInTalkDetail } from '@tests/pages/content/TalkUserJourney'

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
      const journey = await userInTalkList(page, locale)
      await journey.shouldHaveTitle()
    })

    test(`talk detail shows title and tags (${locale})`, { tag: [`@${locale}`] }, async ({ page }) => {
      const journey = await userInTalkDetail(page, locale, SLUG)
      await journey.shouldHaveTitle(expectedTitles[locale])
      await journey.shouldHaveTags(expectedTags[locale])
    })

    test(`talk detail has comments (${locale})`, { tag: [`@${locale}`] }, async ({ page }) => {
      const journey = await userInTalkDetail(page, locale, SLUG)
      await journey.shouldHaveComments()
    })
  }
})
