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
    test(`work list shows title (${locale})`, { tag: [`@${locale}`] }, async ({ page }) => {
      const journey = await userInWorkList(page, locale)
      await journey.shouldHaveTitle()
    })
  }

  for (const f of fixtures) {
    test(`work detail shows title and role (${f.locale})`, { tag: [`@${f.locale}`] }, async ({ page }) => {
      const journey = await userInWorkDetail(page, f.locale, f.slug)
      await journey.shouldHaveTitle(f.title)
      await journey.shouldHaveRole(f.role)
      await journey.shouldHaveWebsite(f.website)
    })
  }
})
