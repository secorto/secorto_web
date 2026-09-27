import type { Locator } from '@playwright/test'
import { target, type TargetComponent } from './target'
import { verifyStep, step, type Verification } from '@tests/step'

export type Link = TargetComponent & {
  hrefMatches: (locale: string, route: string) => Verification<void>
  linksMatchPattern: (pattern: RegExp) => Verification<void>
}

export function link(name: string, locator: Locator): Link {
  const base = target(name, locator)

  return {
    ...base,

    hrefMatches: (locale: string, route: string) =>
      verifyStep(`${name} href matches route ${route}`, async ({ expect }) => {
        await expect(locator).toBeVisible()
        const href = await locator.getAttribute('href')
        expect(href).toBeTruthy()
        expect(href).toMatch(new RegExp(`^.*\\/${locale}\\/${route}\\/`))
      }),

    linksMatchPattern: (pattern: RegExp) =>
      verifyStep(`${name} all links match pattern ${pattern}`, async ({ expect }) => {
        const links = await locator.evaluateAll(nodes =>
          nodes.map(n => n.getAttribute('href'))
        )

        expect(links.length).toBeGreaterThan(0)

        for (const [i, href] of links.entries()) {
          await step(`link ${href} href matches pattern ${pattern}`, async () => {
            expect(href, `Item ${i} has no href`).toBeTruthy()
            expect(href!, `Item ${i} href mismatch`).toMatch(pattern)
          })
        }
      }),
  } satisfies Link
}

