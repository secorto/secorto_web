import { test } from '@tests/fixtures'
import { languageKeys, type UILanguages } from '@i18n/ui'
import { userInTalkList } from '@tests/pages/TalkUserJourney'

const SLUG = '2023-09-27-devcontainers'

const expectedTitles: Record<UILanguages, string> = {
  es: 'Devcontainers en localhost',
  en: 'Devcontainers on localhost',
}

test.describe('Charlas - flujo de navegación', { tag: ['@flow', '@talk'] }, () => {
  for (const locale of languageKeys) {
    test(`navega de lista a detalle via tag y click (${locale})`, async ({
      Given, When, Then, And, page,
    }) => {
      const list = await Given(userInTalkList(page, locale))
      await When(list.filterByTag('containers'))
      await And(list.shouldShowFilteredTitle('containers'))
      const detail = await When(list.clickItem(SLUG))
      await Then(detail.shouldHaveTitle(expectedTitles[locale]))
    })
  }
})
