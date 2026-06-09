import { test } from '@tests/fixtures'
import { languageKeys, ui, type UILanguages } from '@i18n/ui'
import { userInTalkList } from '@tests/support/ui/content/TalkPages'
import { contentDetailsPath } from '@tests/support/ui/shared/NavigationPaths'

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
      const expectedSectionTitle = ui[locale]['nav.talks']
      await list.filterByTag('containers')
      await list.shouldHaveFilteredTitle(expectedSectionTitle, 'containers')
      const detailPath = contentDetailsPath('talk', locale, SLUG)
      await list.clickItem(detailPath, `click talk item "${SLUG}"`)
      await list.shouldHaveDetailTitle(expectedTitles[locale])
    })
  }
})
