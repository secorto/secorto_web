import type { Page } from '@playwright/test'
import type { TargetSelector } from './Target'
import { targetSelector } from './Target'

/**
 * SeoValidator - For meta tags with content attribute
 */
export class SeoValidator<T = string> {
  constructor(private ts: TargetSelector<T>) {}

  /**
   * Get single target by value
   */
  get(value: T) {
    return this.ts.get(value)
  }

  /**
   * Validate multiple targets with expected content values
   * @param fields - Object with field names as keys and expected content values
   * @returns Promise that validates all fields
   * @example
   *   await seoTwitter(page).validate({ 
   *     card: 'summary_large_image', 
   *     title: /.+/,
   *     creator: '@author'
   *   })
   */
  validate(fields: Record<string, string | RegExp>): Promise<void> {
    return Promise.all(
      Object.entries(fields).map(([field, expected]) =>
        this.ts.get(field as unknown as T).shouldHaveAttribute('content', expected)
      )
    ).then()
  }
}

/**
 * SeoAlternatesValidator - For hreflang links with href attribute
 */
export class SeoAlternatesValidator {
  constructor(private ts: TargetSelector<string>) {}

  get(value: string) {
    return this.ts.get(value)
  }

  validate(fields: Record<string, string | RegExp>): Promise<void> {
    return Promise.all(
      Object.entries(fields).map(([field, expected]) =>
        this.ts.get(field).shouldHaveAttribute('href', expected)
      )
    ).then()
  }
}

/**
 * Factory: seoOpenGraph
 */
export function seoOpenGraph(page: Page) {
  const ts = targetSelector(
    'og',
    (field) => page.locator(`head meta[property="og:${field}"]`)
  )
  return new SeoValidator(ts)
}

/**
 * Factory: seoTwitter
 */
export function seoTwitter(page: Page) {
  const ts = targetSelector(
    'twitter',
    (field) => page.locator(`head meta[property="twitter:${field}"]`)
  )
  return new SeoValidator(ts)
}

/**
 * Factory: seoAlternates
 */
export function seoAlternates(page: Page) {
  const ts = targetSelector(
    'alternates',
    (lang) => page.locator(`head link[rel="alternate"][hreflang="${lang}"]`)
  )
  return new SeoAlternatesValidator(ts)
}
