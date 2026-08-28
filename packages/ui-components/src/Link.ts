import type { Locator } from '@playwright/test'
import type { StepFn, VerifyStepFn } from '@secorto/step'
import { Target } from './Target'

export class Link extends Target {
  hrefMatches(locale: string, route: string) {
    return this['verifyStep'](`${this.name} href matches route ${route}`, async ({ expect }) => {
      const el = this.locator
      await expect(el).toBeVisible()
      const href = await el.getAttribute('href')
      expect(href).toBeTruthy()
      expect(href).toMatch(new RegExp(`^.*\\/${locale}\\/${route}\\/`))
    })
  }

  linksMatchPattern(pattern: RegExp) {
    return this['verifyStep'](`${this.name} all links match pattern ${pattern}`, async ({ expect }) => {
      const links = await this.locator.evaluateAll(nodes =>
        nodes.map(n => n.getAttribute('href'))
      )

      expect(links.length).toBeGreaterThan(0)

      for (const [i, href] of links.entries()) {
        await this['step'](`link ${href} href matches pattern ${pattern}`, async () => {
          expect(href, `Item ${i} has no href`).toBeTruthy()
          expect(href!, `Item ${i} href mismatch`).toMatch(pattern)
        })
      }
    })
  }
}
