import { test } from '@tests/fixtures'
import { userInHome } from '@tests/pages/ColorSwitchUserJourney'

const schemes: Array<'light' | 'dark'> = ['light', 'dark']

for (const colorScheme of schemes) {
  test.describe(`Color switch — ${colorScheme}`,
    { tag: ['@color-switch', '@functional'] },
    () => {
      test.use({ colorScheme })
      test(`toggles between light and dark mode (start ${colorScheme})`, async ({ page, Given, When, Then, And }) => {
        const journey = await Given(userInHome(page, 'en'))
        await And(journey.shouldHaveTheme(colorScheme))
        const initialTransform = await When(journey.getTransformOfThemeToggle())
        await And(journey.toggleTheme())
        await Then(journey.themeToggleShouldBeDifferent(initialTransform))
      })
    })
}
