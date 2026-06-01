import { test } from '@tests/fixtures'
import type { UILanguages } from '@i18n/ui'
import { userInWorkList, userInWorkDetail } from '@tests/pages/content/WorkUserJourney'

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
    test(`work list shows title (${locale})`, { tag: [`@${locale}`] }, async ({ Given, Then, page }) => {
      const journey = await Given(userInWorkList(page, locale))
      await Then(journey.shouldHaveTitle())
    })
  }

  for (const f of fixtures) {
    test(`work detail shows title and role (${f.locale})`, { tag: [`@${f.locale}`] }, async ({ Given, Then, And, page }) => {
      const journey = await Given(userInWorkDetail(page, f.locale, f.slug))
      await Then(journey.shouldHaveTitle(f.title))
      await And(journey.shouldHaveRole(f.role))
      await And(journey.shouldHaveWebsite(f.website))
    })
  }
})
