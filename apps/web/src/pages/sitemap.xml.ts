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

import { generateSitemap } from '@lib/sitemap-adapter'

export async function GET() {
  const siteUrl = import.meta.env.SITE

  if (!siteUrl) {
    return new Response(
      'Error: SITE environment variable is not configured',
      { status: 500, headers: { 'Content-Type': 'text/plain' } }
    )
  }

  try {
    const xml = await generateSitemap(siteUrl.replace(/\/$/, '')) // Remove trailing slash if present

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return new Response(`Sitemap generation failed: ${message}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    })
  }
}
