import { verifyStep, type Verification } from '@tests/step'
import type { Page } from '@playwright/test'

/**
 * Creates a URL validator function that checks if the current page URL matches an expected pattern.
 *
 * @example
 * const validate = urlValidator(page)
 * await validate('/es/blog/mi-post').with(expect)
 */
export function urlValidator(page: Page) {
  return function validateUrl(expected: string | RegExp): Verification<void> {
    return verifyStep(`url should match ${expected}`, async ({ expect }) => {
      await expect(page).toHaveURL(expected)
    })
  }
}

/**
 * URL validation flow: escapes path and creates RegExp for trailing slash matching.
 * Handles regex metacharacters to prevent unintended pattern matching.
 *
 * @example
 * const pattern = buildUrlPattern('/es/blog/mi-post')
 * // => RegExp matching "/es/blog/mi-post" or "/es/blog/mi-post/"
 */
export function buildUrlPattern(path: string): RegExp {
  const escaped = path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`${escaped}(/|$)`)
}
