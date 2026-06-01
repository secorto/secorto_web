import { test } from '@tests/fixtures'
import { userInHome } from '@tests/pages/home/ColorSwitchUserJourney'

test.describe('Theme local storage',
  { tag: ['@theme-local-storage', '@functional'] },
  () => {
    const cases: Array<{startTheme: 'dark' | 'light'; toggledTheme: 'dark' | 'light'}> = [
      { startTheme: 'dark', toggledTheme: 'light' },
      { startTheme: 'light', toggledTheme: 'dark' },
    ]

    for (const { startTheme, toggledTheme } of cases) {
      test(`start ${startTheme} → toggle → ${toggledTheme}`,
        async ({ page, When, Given, Then, And }) => {
          const home = await Given(userInHome(page, 'en', { theme: startTheme }))
          await When(home.toggleTheme())
          await Then(home.shouldHaveTheme(toggledTheme))
          await And(home.shouldHaveThemeStorage(toggledTheme))
        })
    }
  })
