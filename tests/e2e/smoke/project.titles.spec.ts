import { test } from '@tests/fixtures'
import { ui, type UILanguages } from '@i18n/ui'
import { userInProjectList, userInProjectDetail } from '@tests/pages/content/ProjectPages'
import { contentListPath, contentDetailsPath } from '@tests/pages/shared/NavigationPaths'
import { pageHelper } from '@tests/pages/components/PageHelper'

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

type ProjectFixture = { locale: UILanguages; slug: string; title: string; role: string }

const fixtures: ProjectFixture[] = [
  {
    locale: 'es',
    slug: 'scot3004',
    title: 'Sitio web personal',
    role: 'Ingeniero de desarrollo',
  },
  {
    locale: 'en',
    slug: 'scot3004',
    title: 'Personal website',
    role: 'Development Engineer',
  },
]

test.describe('Projects', { tag: ['@smoke', '@projects'] }, () => {
  for (const locale of ['es', 'en'] as UILanguages[]) {
    test(`project list shows title (${locale})`, { tag: [`@${locale}`] }, async ({ page }) => {
      const list = await userInProjectList(page, locale)
      const listPath = contentListPath('projects', locale)
      const expectedHeaderTitle = ui[locale]['nav.projects']

      await pageHelper(page).shouldHaveURL(listPath)
      await pageHelper(page).shouldHaveTitle(new RegExp(`^${escapeRegExp(expectedHeaderTitle)} \\| SeCOrTo$`))
      await list.shouldHaveListHeaderTitle(expectedHeaderTitle)
    })
  }

  for (const f of fixtures) {
    test(`project detail shows title and role (${f.locale})`, { tag: [`@${f.locale}`] }, async ({ page }) => {
      const detail = await userInProjectDetail(page, f.locale, f.slug)
      await pageHelper(page).shouldHaveURL(contentDetailsPath('projects', f.locale, f.slug))
      await detail.shouldHaveDetailTitle(f.title)
      await detail.shouldHaveRole(f.role)
    })
  }
})
