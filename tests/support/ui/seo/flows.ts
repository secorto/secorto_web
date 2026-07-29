import { verifyStep } from '@tests/fixtures'
import type { Page } from '@playwright/test'
import { languageKeys } from '@i18n/ui'
import { homePath } from '@tests/support/ui/shared/NavigationPaths'
import type { UILanguages } from '@i18n/ui'
import type { PageMetadata } from '@tests/support/ui/components/PageMetadata'

function shouldHaveTitleTag(page: Page) {
  return verifyStep('title tag is correct with branding', async ({ expect }) => {
    const title = await page.locator('head title').textContent()
    expect(title, 'title should contain SeCOrTo').toContain('SeCOrTo')
    expect(title, 'title should not be empty').toBeTruthy()
  })
}

function shouldHaveMetaDescription(page: Page) {
  return verifyStep('meta description exists with optimal length', async ({ expect }) => {
    const content = await page.locator('head meta[name="description"]').getAttribute('content')
    expect(content, 'meta description should exist').toBeTruthy()
    expect(content?.length, 'meta description length should be >= 50').toBeGreaterThanOrEqual(50)
    expect(content?.length, 'meta description length should be <= 160').toBeLessThanOrEqual(160)
  })
}

function shouldHaveCanonicalLink(page: Page, locale: UILanguages) {
  return verifyStep('canonical link points to correct URL', async ({ expect }) => {
    const href = await page.locator('head link[rel="canonical"]').getAttribute('href')
    expect(href, 'canonical href should be defined').toBeDefined()
    expect(href, `canonical href should contain ${homePath(locale)}`).toContain(homePath(locale))
    expect(href, 'canonical href should start with http:// or https://').toMatch(/https?:\/\//)
  })
}

function shouldHaveOpenGraphTags(metadata: PageMetadata, locale: UILanguages) {
  return verifyStep('Open Graph tags are present and correct', async () => {
    await metadata.openGraph.validate({
      type: 'website',
      title: /.+/,
      description: /.+/,
      url: new RegExp(homePath(locale)),
    })
  })
}

function shouldHaveTwitterCardTags(metadata: PageMetadata) {
  return verifyStep('Twitter Card tags are present and correct', async () => {
    await metadata.twitter.validate({
      card: 'summary_large_image',
      title: /.+/,
      description: /.+/,
      url: /.+/,
    })
  })
}

function shouldHaveHreflangAlternates(metadata: PageMetadata) {
  return verifyStep('hreflang alternates exist for all supported languages', async () => {
    const expectedAlternates = languageKeys.reduce(
      (acc, lang) => ({
        ...acc,
        [lang]: new RegExp(homePath(lang)),
      }),
      {} as Record<string, RegExp>
    )
    await metadata.alternates.validate(expectedAlternates)
  })
}

function shouldHaveCorrectHtmlLang(page: Page, locale: UILanguages) {
  return verifyStep('html lang attribute matches page locale', async ({ expect }) => {
    const htmlLang = await page.locator('html').getAttribute('lang')
    expect(htmlLang, `html lang should be "${locale}"`).toBe(locale)
  })
}

function shouldHaveEssentialMetaTags(page: Page) {
  return verifyStep('charset and viewport meta tags are present', async ({ expect }) => {
    const charsetCount = await page.locator('head meta[charset]').count()
    const viewportContent = await page.locator('head meta[name="viewport"]').getAttribute('content')
    expect(charsetCount, 'charset meta tag count should be 1').toBe(1)
    expect(await page.locator('head meta[name="viewport"]').count(), 'viewport meta tag count should be 1').toBe(1)
    expect(viewportContent, 'viewport content should be "width=device-width"').toBe('width=device-width')
  })
}

function shouldNotHaveNoindex(page: Page) {
  return verifyStep('noindex is not set on public homepage', async ({ expect }) => {
    const noindexCount = await page.locator('head meta[name="robots"][content="noindex"]').count()
    expect(noindexCount, 'noindex should not be present (count should be 0)').toBe(0)
  })
}

function shouldHaveFaviconLink(page: Page) {
  return verifyStep('favicon link is present and valid', async ({ expect }) => {
    const href = await page.locator('head link[rel="icon"]').getAttribute('href')
    expect(href, 'favicon href should be defined').toBeDefined()
    expect(href, 'favicon href should contain "favicon"').toContain('favicon')
  })
}


export function shouldRenderSeoCorrectly(page: Page, metadata: PageMetadata, locale: UILanguages) {
  return verifyStep('SEO metadata is rendered correctly', async ({ expect }) => {
    await shouldHaveTitleTag(page).with(expect)
    await shouldHaveMetaDescription(page).with(expect)
    await shouldHaveCanonicalLink(page, locale).with(expect)
    await shouldHaveOpenGraphTags(metadata, locale).with(expect)
    await shouldHaveTwitterCardTags(metadata).with(expect)
    await shouldHaveHreflangAlternates(metadata).with(expect)
    await shouldHaveCorrectHtmlLang(page, locale).with(expect)
    await shouldHaveEssentialMetaTags(page).with(expect)
    await shouldNotHaveNoindex(page).with(expect)
    await shouldHaveFaviconLink(page).with(expect)
  })
}

