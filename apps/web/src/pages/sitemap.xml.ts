/**
 * Generates and serves the XML sitemap for SEO.
 *
 * This endpoint:
 * - Uses the asymmetric multilingual sitemap builder
 * - Respects content state (available only, no drafts)
 * - Includes hreflang links for all translations
 * - Groups URLs by translation key for consistency
 */

import { generateSitemap, validateSitemapXml } from '@lib/sitemap'

export async function GET() {
  const siteUrl = import.meta.env.SITE

  const xml = await generateSitemap({
    site: siteUrl.replace(/\/$/, ''), // Remove trailing slash if present
    includeDrafts: false,
  })

  // Validate the generated XML
  const errors = validateSitemapXml(xml)
  if (errors.length > 0) {
    console.warn('Sitemap validation errors:', errors)
  }

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  })
}
