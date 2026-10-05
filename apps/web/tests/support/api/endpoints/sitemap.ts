import { z } from 'zod'
import { xml } from '@tests/support/api/parsers/xml'
import { resourceStep, verifyStep, step } from '@tests/step'
import type { APIRequestContext, APIResponse } from '@playwright/test'
import type { ExpectLike } from '@tests/step'
import { languageKeys } from '@i18n/ui'

export const sitemapSchema = z.object({
  urlset: z.object({
    url: z.array(
      z.object({
        loc: z.string(),
        'xhtml:link': z.union([
          z.object({
            rel: z.string().optional(),
            hreflang: z.string().optional(),
            href: z.string().optional(),
          }),
          z.array(z.object({
            rel: z.string().optional(),
            hreflang: z.string().optional(),
            href: z.string().optional(),
          }))
        ]).optional(),
      })
    ),
  }),
})

export type Sitemap = z.infer<typeof sitemapSchema>

type HreflangLink = {
  rel?: string
  hreflang?: string
  href?: string
}

type UrlEntry = z.infer<typeof sitemapSchema>['urlset']['url'][number]

const normalizeHreflangLinks = (xhtmlLink: UrlEntry['xhtml:link']): HreflangLink[] => {
  if (!xhtmlLink) return []
  return Array.isArray(xhtmlLink) ? xhtmlLink : [xhtmlLink]
}

const validateHreflangLink = (expect: ExpectLike, link: HreflangLink, locales: string[]) =>
  step(`hreflang ${link.hreflang}`, async () => {
    expect(locales, `hreflang ${link.hreflang} should be in group`).toContain(link.hreflang)
  })

const validateUrlEntryHreflang = (expect: ExpectLike, entry: UrlEntry, locales: string[]) =>
  step(`validate hreflang for ${entry.loc}`, async () => {
    const links = normalizeHreflangLinks(entry['xhtml:link'])
    expect(links.length, `URL ${entry.loc} should have hreflang links`).toBeGreaterThan(0)
    
    for (const link of links) {
      await validateHreflangLink(expect, link, locales)
    }
  })

const validateHreflangGroup = (expect: ExpectLike, body: Sitemap['urlset'], group: { paths: string[], locales: string[] }) =>
  step(`hreflang group: ${group.paths.join(', ')}`, async () => {
    const urlEntries = body.url.filter(url => 
      group.paths.some(path => url.loc.includes(path))
    )
    
    expect(urlEntries.length, `Should find URLs for paths: ${group.paths.join(', ')}`).toBeGreaterThan(0)
    
    for (const entry of urlEntries) {
      await validateUrlEntryHreflang(expect, entry, group.locales)
    }
  })

const validateHreflangAlternates = (body: Sitemap['urlset']) => 
  (groups?: Array<{ paths: string[], locales: string[] }>) => 
    verifyStep('sitemap.xml includes hreflang alternates', async ({ expect }) => {
      if (!groups) {
        // Simple check: just verify hreflang exists
        const hasHreflang = body.url.some(entry => entry['xhtml:link'])
        expect(hasHreflang, 'Sitemap should include hreflang alternates').toBe(true)
        return
      }

      // Validate specific hreflang groups
      for (const group of groups) {
        await validateHreflangGroup(expect, body, group)
      }
    })

const validateLocales = (body: Sitemap['urlset']) =>
  () => verifyStep('sitemap.xml includes locale paths', async ({ expect }) => {
    const allLocs = body.url.map(entry => entry.loc).join(' ')
    for (const lang of languageKeys) {
      expect(allLocs).toContain(`/${lang}/`)
    }
  })

export const sitemapParser = async (response: APIResponse) => {
  const body = await xml(sitemapSchema)(response)

  return {
    response,
    body,
    shouldHaveHreflangAlternates: validateHreflangAlternates(body.urlset),
    shouldIncludeLocales: validateLocales(body.urlset),
  }
}

export const sitemap = (request: APIRequestContext) =>
  resourceStep(
    'fetch sitemap.xml',
    async () => request.get('/sitemap.xml'),
    sitemapParser,
  )
