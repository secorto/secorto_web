import { test } from '@tests/fixtures'
import type { UILanguages } from '@i18n/ui'
import { userInCommunityList, userInCommunityDetail } from '@tests/pages/content/CommunityUserJourney'

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
      const journey = await userInCommunityList(page, locale)
      await journey.shouldHaveTitle()
    })
  }

  for (const f of fixtures) {
    test(`community detail shows title, role and website (${f.locale})`, { tag: [`@${f.locale}`] }, async ({ page }) => {
      const journey = await userInCommunityDetail(page, f.locale, f.slug)
      await journey.shouldHaveTitle(f.title)
      await journey.shouldHaveRole(f.role)
      await journey.shouldHaveWebsite(f.website)
    })
  }
})
