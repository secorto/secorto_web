import { test } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import { homePath, visit } from '@tests/support/ui/shared/NavigationPaths'
import { pageMetadata } from '@tests/support/ui/components/PageMetadata'
import { shouldRenderSeoCorrectly } from '@tests/support/ui/seo/flows'

/**
 * SEO validation test for homepage
 * Single comprehensive test with SEO flows as separate observable steps
 */
for (const locale of languageKeys) {
  test(
    `Homepage SEO (${locale})`,
    { tag: ['@seo', '@home', `@${locale}`] },
    async ({ page }) => {
      await visit('user navigates to homepage', page, homePath(locale), () => ({}))
      const metadata = pageMetadata(page)
      await shouldRenderSeoCorrectly(page, metadata, locale).soft()
    }
  )
}
