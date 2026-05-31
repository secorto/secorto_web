import { test } from '@tests/fixtures'
import { userInHomeWithStorageTheme } from '@tests/pages/HomePage'

test.describe('Theme local storage',
  { tag: ['@theme-local-storage', '@functional'] },
  () => {
    const cases: Array<{startTheme: 'dark' | 'light'; toggledTheme: 'dark' | 'light'}> = [
      { startTheme: 'dark', toggledTheme: 'light' },
      { startTheme: 'light', toggledTheme: 'dark' },
    ]

    for (const { startTheme, toggledTheme } of cases) {
      test(`start ${startTheme} → toggle → ${toggledTheme}`,
        async ({ page, When, Given, Then }) => {
          const home = await Given(userInHomeWithStorageTheme(page, 'en', startTheme))
          await When(home.toggleTheme())
          await Then(home.shouldHaveTheme(toggledTheme))
          await Then(home.shouldHaveThemeStorage(toggledTheme))
        })
    }
  })
