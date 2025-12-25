#!/usr/bin/env node
/**
 * check-translation-inconsistencies.js
 *
 * Scans `src/content/<collection>/<locale>/*` for small classes of metadata
 * inconsistencies related to translation_status and translation_origin. The
 * goal is to help detect and fix common mistakes that would confuse the site
 * templates or the translation workflow.
 *
 * Checks performed (non-exhaustive):
 *  - `translated_missing_origin`: a file declares `translation_status: translated`
 *     but lacks a `translation_origin` block
 *  - `origin_but_not_translated`: a file declares `translation_origin` but is not
 *     marked `translation_status: translated`
 *  - `origin_present_both_original`: a file declares `translation_origin` but
 *     both source and target are marked `original` (suspicious)
 *
 * Usage:
 *   node ./scripts/check-translation-inconsistencies.js
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..')
const contentDir = path.join(root, 'src', 'content')

/**
 * Recursively list .md files under a directory.
 * @param {string} dir
 * @returns {string[]}
 */
function listMdFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  let files = []
  for (const e of entries) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) files = files.concat(listMdFiles(p))
    else if (e.isFile() && p.endsWith('.md')) files.push(p)
  }
  return files
}

/**
 * Read frontmatter slice and remainder of file.
 * @param {string} content
 * @returns {{fm: string|null, rest: string}}
 */
function readFrontmatter(content) {
  if (!content.startsWith('---')) return { fm: null, rest: content }
  const end = content.indexOf('\n---', 3)
  if (end === -1) return { fm: content, rest: '' }
  const fm = content.slice(0, end + 4)
  const rest = content.slice(end + 4)
  return { fm, rest }
}

/**
 * Very small YAML-ish frontmatter parser to extract a couple of fields we care about.
 * It's intentionally permissive and only supports the small shapes used here.
 * @param {string|null} fm
 * @returns {Record<string, any>}
 */
function parseFmToMap(fm) {
  if (!fm) return {}
  const obj = {}
  const lines = fm.split('\n').slice(1) // drop leading ---
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const m = line.match(/^([A-Za-z0-9_\-]+)\s*:\s*(.*)$/)
    if (m) obj[m[1]] = m[2].trim().replace(/^['\"]|['\"]$/g, '')
    // naive nested handling for translation_origin
    if (line.trim().startsWith('translation_origin:')) {
      const localeLine = lines[i+1] || ''
      const idLine = lines[i+2] || ''
      const ml = localeLine.match(/locale:\s*['\"]?(.*?)['\"]?$/)
      const mid = idLine.match(/id:\s*['\"]?(.*?)['\"]?$/)
      if (ml) obj.translation_origin = obj.translation_origin || {}
      if (ml) obj.translation_origin.locale = ml[1]
      if (mid) obj.translation_origin = obj.translation_origin || {}
      if (mid) obj.translation_origin.id = mid[1]
    }
  }
  return obj
}

const files = listMdFiles(contentDir)
const map = new Map()
for (const f of files) {
  const rel = path.relative(contentDir, f)
  const parts = rel.split(path.sep)
  if (parts.length < 3) continue
  const [collection, locale, ...rest] = parts
  const id = rest.join(path.sep)
  const coll = map.get(collection) || new Map()
  const entry = coll.get(id) || new Map()
  const content = fs.readFileSync(f, 'utf8')
  const { fm } = readFrontmatter(content)
  const fmObj = parseFmToMap(fm)
  entry.set(locale, { path: f, fm: fmObj })
  coll.set(id, entry)
  map.set(collection, coll)
}

const inconsistencies = []

for (const [collection, collMap] of map.entries()) {
  for (const [id, locales] of collMap.entries()) {
    const localesList = Array.from(locales.keys())
    if (localesList.length < 2) continue
    // collect statuses and origins
    const info = {}
    for (const [locale, data] of locales.entries()) {
      info[locale] = { status: data.fm && data.fm.translation_status, origin: data.fm && data.fm.translation_origin }
    }

    // 1) translation exists but not marked translated or missing translation_origin
    for (const [locale, data] of Object.entries(info)) {
      if (data.status === 'translated' && (!data.origin || !data.origin.locale || !data.origin.id)) {
        inconsistencies.push({ collection, id, type: 'translated_missing_origin', locale })
      }
    }

    // 3) a translation file exists and declares origin but not marked 'translated'
    for (const [locale, data] of Object.entries(info)) {
      if (data.origin && data.origin.locale) {
        // this file claims to be a translation; ensure status === 'translated'
        if (data.status !== 'translated') {
          inconsistencies.push({ collection, id, type: 'origin_but_not_translated', locale, origin: data.origin })
        }
      }
    }

    // 4) both files marked 'original' but one has translation_origin pointing to the other -> inconsistency
    for (const [locale, data] of Object.entries(info)) {
      if (data.origin && data.origin.locale) {
        const target = data.origin.locale
        const targetData = info[target]
        if (targetData && targetData.status === 'original' && data.status === 'original') {
          // translation_origin exists but both marked original
          inconsistencies.push({ collection, id, type: 'origin_present_both_original', locale, origin: data.origin })
        }
      }
    }
  }
}

if (inconsistencies.length === 0) {
  console.log('No inconsistencies found — looks good')
  process.exit(0)
}

console.log(`Found ${inconsistencies.length} inconsistency(ies):`)
for (const inc of inconsistencies) {
  console.log('-', inc)
}

process.exit(0)
