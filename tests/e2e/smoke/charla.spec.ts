import { test } from '@tests/fixtures'
import { languageKeys, type UILanguages } from '@i18n/ui'
import { userInTalkList, userInTalkDetail } from '@tests/pages/TalkUserJourney'

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
    test(`talk list shows title (${locale})`, async ({ Given, Then, page }) => {
      const journey = await Given(userInTalkList(page, locale))
      await Then(journey.shouldHaveTitle())
    })

    test(`talk detail shows title and tags (${locale})`, async ({ Given, Then, And, page }) => {
      const journey = await Given(userInTalkDetail(page, locale, SLUG))
      await Then(journey.shouldHaveTitle(expectedTitles[locale]))
      await And(journey.shouldHaveTags(expectedTags[locale]))
    })

    test(`talk detail has comments (${locale})`, async ({ Given, Then, page }) => {
      const journey = await Given(userInTalkDetail(page, locale, SLUG))
      await Then(journey.shouldHaveComments())
    })
  }
})
