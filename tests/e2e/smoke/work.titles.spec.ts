import { test } from '@tests/fixtures'
import { ui, type UILanguages } from '@i18n/ui'
import { userInWorkList, userInWorkDetail } from '@tests/pages/content/WorkUserJourney'
import { contentListPath, contentDetailsPath } from '@tests/pages/shared/NavigationPaths'
import { pageHelper } from '@tests/pages/components/PageHelper'

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

type WorkFixture = { locale: UILanguages; slug: string; title: string; role: string; website: string }

const fixtures: WorkFixture[] = [
  {
    locale: 'es',
    slug: 'perficient',
    title: 'Perficient Latinoamerica',
    role: 'Software developer engineer in test',
    website: 'https://www.perficient.com',
  },
  {
    locale: 'en',
    slug: 'perficient',
    title: 'Perficient Latinoamerica',
    role: 'Senior Technical Consultant',
    website: 'https://www.perficient.com',
  },
]

test.describe('Work', { tag: ['@smoke', '@work'] }, () => {
  for (const locale of ['es', 'en'] as UILanguages[]) {
    test(`work list shows title (${locale})`, { tag: [`@${locale}`] }, async ({ page }) => {
      const list = await userInWorkList(page, locale)
      const listPath = contentListPath('work', locale)
      const expectedHeaderTitle = ui[locale]['nav.work']

      await pageHelper(page).shouldHaveURL(listPath)
      await pageHelper(page).shouldHaveTitle(new RegExp(`^${escapeRegExp(expectedHeaderTitle)} \\| SeCOrTo$`))
      await list.shouldHaveListHeaderTitle(expectedHeaderTitle)
    })
  }

  for (const f of fixtures) {
    test(`work detail shows title and role (${f.locale})`, { tag: [`@${f.locale}`] }, async ({ page }) => {
      const detail = await userInWorkDetail(page, f.locale, f.slug)
      await pageHelper(page).shouldHaveURL(contentDetailsPath('work', f.locale, f.slug))
      await detail.shouldHaveDetailTitle(f.title)
      await detail.shouldHaveRole(f.role)
      await detail.shouldHaveWebsite(f.website)
    })
  }
})
