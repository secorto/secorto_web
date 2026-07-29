import { test } from '@tests/fixtures'
import { userInHome } from '@tests/support/ui/home/pages/HomePage'

const schemes: Array<'light' | 'dark'> = ['light', 'dark']

for (const colorScheme of schemes) {
  test.describe(`Color switch — ${colorScheme}`,
    { tag: ['@color-switch', '@functional', '@home'] },
    () => {
      test.use({ colorScheme })
      test(`toggles between light and dark mode (start ${colorScheme})`, async ({ page }) => {
        const homePage = await userInHome(page, 'en')
        const themePage = homePage.mainLayout
        await themePage.shouldHaveTheme(colorScheme)
        const initialTransform = await themePage.getTransformOfThemeToggle()
        await themePage.toggleTheme()
        await themePage.themeToggleShouldBeDifferent(initialTransform)
      })
    })
}
