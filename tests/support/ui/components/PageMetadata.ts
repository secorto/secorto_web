import type { Page } from '@playwright/test'
import { verifyStep } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import { homePath } from '@tests/support/ui/shared/NavigationPaths'
import type { UILanguages } from '@i18n/ui'
import { seoOpenGraph, seoTwitter, seoAlternates } from './SeoLabels'

export class PageMetadata {
  constructor(
    readonly openGraph: ReturnType<typeof seoOpenGraph>,
    readonly twitter: ReturnType<typeof seoTwitter>,
    readonly alternates: ReturnType<typeof seoAlternates>,
  ) {}

  shouldHaveOpenGraphTags(locale: UILanguages) {
    return verifyStep('Open Graph tags are present and correct', async () => {
      await this.openGraph.validate({
        type: 'website',
        title: /.+/,
        description: /.+/,
        url: new RegExp(homePath(locale)),
      })
    })
  }

  shouldHaveTwitterCardTags() {
    return verifyStep('Twitter Card tags are present and correct', async () => {
      await this.twitter.validate({
        card: 'summary_large_image',
        title: /.+/,
        description: /.+/,
        url: /.+/,
      })
    })
  }

  shouldHaveHreflangAlternates() {
    return verifyStep('hreflang alternates exist for all supported languages', async () => {
      const expectedAlternates = languageKeys.reduce(
        (acc, lang) => ({
          ...acc,
          [lang]: new RegExp(homePath(lang)),
        }),
        {} as Record<string, RegExp>
      )
      await this.alternates.validate(expectedAlternates)
    })
  }
}

export function pageMetadata(page: Page): PageMetadata {
  return new PageMetadata(seoOpenGraph(page), seoTwitter(page), seoAlternates(page))
}


