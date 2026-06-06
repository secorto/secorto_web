import { test } from '@tests/fixtures'
import { userInHome } from '@tests/support/pages/home/ThemeLocaleHomePage'

const schemes: Array<'light' | 'dark'> = ['light', 'dark']

for (const colorScheme of schemes) {
  test.describe(`Color switch — ${colorScheme}`,
    { tag: ['@color-switch', '@functional', '@home'] },
    () => {
      test.use({ colorScheme })
      test(`toggles between light and dark mode (start ${colorScheme})`, async ({ page }) => {
        const themePage = await userInHome(page, 'en')
        await themePage.shouldHaveTheme(colorScheme)
        const initialTransform = await themePage.getTransformOfThemeToggle()
        await themePage.toggleTheme()
        await themePage.themeToggleShouldBeDifferent(initialTransform)
      })
    })
}
