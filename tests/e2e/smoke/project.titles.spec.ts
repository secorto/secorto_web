import { test } from '@tests/fixtures'
import type { UILanguages } from '@i18n/ui'
import { userInProjectList, userInProjectDetail } from '@tests/pages/content/ProjectUserJourney'

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
    test(`project list shows title (${locale})`, async ({ Given, Then, page }) => {
      const journey = await Given(userInProjectList(page, locale))
      await Then(journey.shouldHaveTitle())
    })
  }

  for (const f of fixtures) {
    test(`project detail shows title and role (${f.locale})`, async ({ Given, Then, And, page }) => {
      const journey = await Given(userInProjectDetail(page, f.locale, f.slug))
      await Then(journey.shouldHaveTitle(f.title))
      await And(journey.shouldHaveRole(f.role))
    })
  }
})
