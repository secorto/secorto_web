import { describe, it, expect } from 'vitest'
import { validateSitemapXml } from '@lib/sitemap'

describe('sitemap validation', () => {
  it('validates correct sitemap XML', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://example.com/en</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://example.com/en" />
  </url>
</urlset>`

    const errors = validateSitemapXml(xml)
    expect(errors).toHaveLength(0)
  })

  it('detects missing XML declaration', () => {
    const xml = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url><loc>https://example.com</loc></url>
</urlset>`

    const errors = validateSitemapXml(xml)
    expect(errors).toContain('Missing XML declaration')
  })

  it('detects missing sitemap namespace', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url><loc>https://example.com</loc></url>
</urlset>`

    const errors = validateSitemapXml(xml)
    expect(errors).toContain('Missing sitemap namespace')
  })

  it('detects missing xhtml namespace', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://example.com</loc></url>
</urlset>`

    const errors = validateSitemapXml(xml)
    expect(errors).toContain('Missing xhtml namespace for hreflang support')
  })

  it('detects missing urlset wrapper', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urls xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://example.com</loc></url>
</urls>`

    const errors = validateSitemapXml(xml)
    expect(errors).toContain('Missing urlset wrapper')
  })

  it('detects url without loc', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <priority>0.5</priority>
  </url>
</urlset>`

    const errors = validateSitemapXml(xml)
    expect(errors).toContain('Found <url> without <loc>')
  })
})
