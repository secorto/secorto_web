/**
 * Converts sitemap entries to XML format with hreflang support.
 *
 * Each entry includes translationLinks (locale → url map),
 * so hreflang alternates are built directly from the entry structure.
 */

import type { SitemapUrlEntry } from './entry'

/**
 * Escapes XML special characters in URL and text content.
 *
 * @param text String to escape.
 * @returns Escaped string safe for XML.
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Generates a single <url> block with hreflang alternates.
 *
 * @template TLocale Locale type.
 * @param entry Entry with translationLinks for hreflang generation.
 * @returns XML string for one <url> block.
 */
function generateUrlBlock<TLocale extends string>(entry: SitemapUrlEntry<TLocale>): string {
  let xml = '  <url>\n'
  xml += `    <loc>${escapeXml(entry.url)}</loc>\n`

  if (entry.lastmod) {
    xml += `    <lastmod>${escapeXml(entry.lastmod)}</lastmod>\n`
  }

  if (entry.changefreq) {
    xml += `    <changefreq>${escapeXml(entry.changefreq)}</changefreq>\n`
  }

  if (entry.priority !== undefined) {
    xml += `    <priority>${entry.priority.toFixed(1)}</priority>\n`
  }

  // Add hreflang alternates if we have multiple translations
  const locales = Object.keys(entry.translationLinks) as TLocale[]
  if (locales.length > 1) {
    for (const locale of locales) {
      const url = entry.translationLinks[locale]
      xml += `    <xhtml:link rel="alternate" hreflang="${escapeXml(locale)}" href="${escapeXml(url)}" />\n`
    }

    // Add x-default link using defaultLocale
    const defaultUrl = entry.translationLinks[entry.defaultLocale]
    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(defaultUrl)}" />\n`
  }

  xml += '  </url>\n'
  return xml
}

/**
 * Converts sitemap entries to XML format.
 *
 * Generates a complete sitemap.xml with proper XML declaration, namespaces,
 * and hreflang alternates.
 *
 * @template TLocale Locale type.
 * @param entries Array of entries, each with translationLinks for all translations.
 * @returns Complete XML string ready to serve as sitemap.xml.
 */
export function generateSitemapXml<TLocale extends string>(
  entries: SitemapUrlEntry<TLocale>[]
): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'

  for (const entry of entries) {
    xml += generateUrlBlock(entry)
  }

  xml += '</urlset>\n'
  return xml
}


