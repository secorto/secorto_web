/**
 * Generates and serves the XML sitemap for SEO.
 *
 * Endpoint: GET /sitemap.xml
 *
 * This endpoint:
 * - Generates the complete sitemap with hreflang alternates
 * - Respects content state (available only, no drafts)
 * - Caches for 1 hour
 * - Returns validation errors if generation fails
 */

import { generateSitemap } from '@domain/sitemap-adapter'

export async function GET() {
  const xml = await generateSitemap(import.meta.env.SITE)

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  })
}
