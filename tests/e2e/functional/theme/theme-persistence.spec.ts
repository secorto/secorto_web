import { test } from '@tests/fixtures'
import { userInHome } from '@tests/support/ui/home/ThemeLocaleHomePage'

test.describe('Theme local storage',
  { tag: ['@theme-local-storage', '@functional'] },
  () => {
    const cases: Array<{startTheme: 'dark' | 'light'; toggledTheme: 'dark' | 'light'}> = [
      { startTheme: 'dark', toggledTheme: 'light' },
      { startTheme: 'light', toggledTheme: 'dark' },
    ]

    for (const { startTheme, toggledTheme } of cases) {
      test(`start ${startTheme} → toggle → ${toggledTheme}`,
        async ({ page }) => {
          const home = await userInHome(page, 'en', { theme: startTheme })
          await home.toggleTheme()
          await home.shouldHaveTheme(toggledTheme)
          await home.shouldHaveThemeStorage(toggledTheme)
        })
    }
  })
