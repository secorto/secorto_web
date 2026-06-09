import { test } from '@tests/fixtures'
import { ui, type UILanguages } from '@i18n/ui'
import { userInCommunityList, userInCommunityDetail } from '@tests/support/ui/content/CommunityPages'
import { pageHelper } from '@tests/support/ui/components/PageHelper'

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

type CommunityFixture = { locale: UILanguages; slug: string; title: string; role: string; website: string }

const fixtures: CommunityFixture[] = [
  {
    locale: 'es',
    slug: 'pybaq',
    title: 'Python Barranquilla',
    role: 'Front-End Developer, QA Speaker',
    website: 'https://pybaq.co/',
  },
  {
    locale: 'en',
    slug: 'pybaq',
    title: 'Python Barranquilla',
    role: 'Front-End Developer, QA Speaker',
    website: 'https://pybaq.co/',
  },
]

test.describe('Community', { tag: ['@smoke', '@community'] }, () => {
  for (const locale of ['es', 'en'] as UILanguages[]) {
    test(`community list shows title (${locale})`, { tag: [`@${locale}`] }, async ({ page }) => {
      const list = await userInCommunityList(page, locale)
      const expectedHeaderTitle = ui[locale]['nav.community']
      await pageHelper(page).shouldHaveTitle(new RegExp(`^${escapeRegExp(expectedHeaderTitle)} \\| SeCOrTo$`))
      await list.shouldHaveListHeaderTitle(expectedHeaderTitle)
    })
  }

  for (const f of fixtures) {
    test(`community detail shows title, role and website (${f.locale})`, { tag: [`@${f.locale}`] }, async ({ page }) => {
      const detail = await userInCommunityDetail(page, f.locale, f.slug)
      await detail.shouldHaveDetailTitle(f.title)
      await detail.shouldHaveRole(f.role)
      await detail.shouldHaveWebsite(f.website)
    })
  }
})
