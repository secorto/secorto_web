import { test } from '@tests/fixtures'
import { languageKeys, type UILanguages } from '@i18n/ui'
import { userInTalkList } from '@tests/pages/content/TalkUserJourney'

const SLUG = '2023-09-27-devcontainers'

const expectedTitles: Record<UILanguages, string> = {
  es: 'Devcontainers en localhost',
  en: 'Devcontainers on localhost',
}

test.describe('Charlas - flujo de navegación', { tag: ['@flow', '@talk'] }, () => {
  for (const locale of languageKeys) {
    test(`navega de lista a detalle via tag y click (${locale})`, { tag: [`@${locale}`] }, async ({
      page,
    }) => {
      const list = await userInTalkList(page, locale)
      await list.filterByTag('containers')
      await list.shouldShowFilteredTitle('containers')
      const detail = await list.clickItem(SLUG)
      await detail.shouldHaveTitle(expectedTitles[locale])
    })
  }
})
