import { test } from '@tests/fixtures'
import type { UILanguages } from '@i18n/ui'
import { userInCommunityList, userInCommunityDetail } from '@tests/pages/CommunityUserJourney'

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
    test(`community list shows title (${locale})`, async ({ Given, Then, page }) => {
      const journey = await Given(userInCommunityList(page, locale))
      await Then(journey.shouldHaveTitle())
    })
  }

  for (const f of fixtures) {
    test(`community detail shows title, role and website (${f.locale})`, async ({ Given, Then, And, page }) => {
      const journey = await Given(userInCommunityDetail(page, f.locale, f.slug))
      await Then(journey.shouldHaveTitle(f.title))
      await And(journey.shouldHaveRole(f.role))
      await And(journey.shouldHaveWebsite(f.website))
    })
  }
})
