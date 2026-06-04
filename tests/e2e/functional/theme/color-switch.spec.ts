import { test } from '@tests/fixtures'
import { userInHome } from '@tests/pages/home/ThemeLocaleUserJourney'

const schemes: Array<'light' | 'dark'> = ['light', 'dark']

for (const colorScheme of schemes) {
  test.describe(`Color switch — ${colorScheme}`,
    { tag: ['@color-switch', '@functional', '@home'] },
    () => {
      test.use({ colorScheme })
      test(`toggles between light and dark mode (start ${colorScheme})`, async ({ page }) => {
        const journey = await userInHome(page, 'en')
        await journey.shouldHaveTheme(colorScheme)
        const initialTransform = await journey.getTransformOfThemeToggle()
        await journey.toggleTheme()
        await journey.themeToggleShouldBeDifferent(initialTransform)
      })
    })
}
