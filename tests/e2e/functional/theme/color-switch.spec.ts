import { test } from '@tests/fixtures'
import { userInHome } from '@tests/pages/HomePage'

const schemes: Array<'light' | 'dark'> = ['light', 'dark']

for (const colorScheme of schemes) {
  test.describe(`Color switch — ${colorScheme}`,
    { tag: ['@color-switch', '@functional'] },
    () => {
      test.use({ colorScheme })
      test(`toggles between light and dark mode (start ${colorScheme})`, async ({ page, Given, When, Then, And }) => {
        const home = await Given(userInHome(page, 'en'))
        await And(home.shouldHaveTheme(colorScheme))
        const initialTransform = await When(home.getTransformOfThemeToggle())
        await And(home.toggleTheme())
        await Then(home.themeToggleShouldBeDifferent(initialTransform))
      })
    })
}
