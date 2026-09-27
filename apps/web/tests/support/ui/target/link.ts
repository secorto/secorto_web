import type { Locator } from '@playwright/test'
import { target, type TargetComponent } from './target'
import { step, type Step } from '@tests/step'
import type { ExpectLike } from '@tests/step'

export type Link = TargetComponent & {
  hrefMatches(expect: ExpectLike, locale: string, route: string): Step<void>
  linksMatchPattern(expect: ExpectLike, pattern: RegExp): Step<void>
}

export function link(name: string, locator: Locator): Link {
  const base = target(name, locator)

  return {
    ...base,

    hrefMatches: (expect: ExpectLike, locale: string, route: string) =>
      step(`${name} href matches route ${route}`, async () => {
        await expect(locator).toBeVisible()
        const href = await locator.getAttribute('href')
        expect(href, 'href attribute must exist').toBeTruthy()
        expect(href!).toMatch(new RegExp(`^.*\/${locale}\/${route}\/`))
      }),

    linksMatchPattern: (expect: ExpectLike, pattern: RegExp) =>
      step(`${name} all links match pattern ${pattern}`, async () => {
        const links = await locator.evaluateAll(nodes =>
          nodes.map(n => n.getAttribute('href'))
        )

        expect(links.length).toBeGreaterThan(0)

        for (const [i, href] of links.entries()) {
          await step(`link ${href} matches pattern ${pattern}`, async () => {
            expect(href, `Item ${i} has no href`).toBeTruthy()
            expect(href!, `Item ${i} href mismatch`).toMatch(pattern)
          })
        }
      }),
  } satisfies Link
}

