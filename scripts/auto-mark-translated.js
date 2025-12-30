#!/usr/bin/env node
/**
 * auto-mark-translated.js
 *
 * Detect simple translation pairs (same id present in >1 locale) and
 * automatically add conservative metadata:
 *  - Ensure the selected original has `translation_status: 'original'` if absent
 *  - Ensure translations have `translation_status: 'translated'` and a
 *    `translation_origin` pointing to the original locale/id if absent
 *
 * This script is intentionally conservative: it only writes when the fields
 * are missing and chooses an original locale heuristic (prefer 'es' when
 * present). It is meant to reduce manual work for clearly-identifiable pairs.
 *
 * Usage:
 *   node ./scripts/auto-mark-translated.js
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
 * Check for presence of a given field in a frontmatter slice.
 * @param {string|null} fm
 * @param {string} field
 * @returns {boolean}
 */
function hasField(fm, field) {
  if (!fm) return false
  const re = new RegExp(`^${field}\\s*:\\s*`, 'm')
  return re.test(fm)
}

/**
 * Insert lines before the closing --- in frontmatter (or create a new block).
 * @param {string|null} fm
 * @param {string[]} fieldLines
 * @returns {string}
 */
function insertField(fm, fieldLines) {
  if (!fm) return `---\n${fieldLines.join('\n')}\n---\n\n`
  const insertPos = fm.lastIndexOf('\n---')
  if (insertPos === -1) return fm + '\n' + fieldLines.join('\n')
  const before = fm.slice(0, insertPos)
  const after = fm.slice(insertPos)
  return before + '\n' + fieldLines.join('\n') + after
}

// Build map: collection -> id -> locales -> path
const files = listMdFiles(contentDir)
const map = new Map()
for (const f of files) {
  const rel = path.relative(contentDir, f)
  const parts = rel.split(path.sep)
  if (parts.length < 3) continue // expect collection/locale/id.md
  const [collection, locale, ...rest] = parts
  const id = rest.join(path.sep) // may include subdirs
  const coll = map.get(collection) || new Map()
  const entry = coll.get(id) || new Map()
  entry.set(locale, f)
  coll.set(id, entry)
  map.set(collection, coll)
}

let updatedCount = 0
for (const [collection, collMap] of map.entries()) {
  for (const [id, locales] of collMap.entries()) {
    if (locales.size < 2) continue // only care about items with >1 locale

    // choose an original locale: prefer 'es' if present, else first
    const localesList = Array.from(locales.keys())
    const originalLocale = locales.has('es') ? 'es' : localesList[0]
    const originalPath = locales.get(originalLocale)

    // ensure original has translation_status: 'original'
    try {
      const content = fs.readFileSync(originalPath, 'utf8')
      const { fm, rest } = readFrontmatter(content)
      if (!hasField(fm, 'translation_status')) {
        let newFm = insertField(fm || '---\n---\n', [`translation_status: 'original'`])
        // add a change_log entry describing this automated action
        const today = new Date().toISOString().slice(0,10)
        const entry = [`date: ${today}`, `author: 'script:auto-mark-translated'`, `summary: 'Marked as original (auto mark)'`, `type: 'meta'`]
        newFm = appendChangeLog(newFm, entry)
        fs.writeFileSync(originalPath, newFm + rest, 'utf8')
        updatedCount++
      }
    } catch (err) {
      console.error('error reading original', originalPath, err.message)
    }

    // for every other locale, mark as translated and add translation_origin if missing
    for (const [locale, p] of locales.entries()) {
      if (locale === originalLocale) continue
      try {
        const content = fs.readFileSync(p, 'utf8')
        const { fm, rest } = readFrontmatter(content)
        const needStatus = !hasField(fm, 'translation_status')
        const needOrigin = !hasField(fm, 'translation_origin')
        if (needStatus || needOrigin) {
          let newFm = fm || '---\n---\n'
          const lines = []
          if (needStatus) lines.push(`translation_status: 'translated'`)
          if (needOrigin) {
            lines.push('translation_origin:')
            lines.push(`  locale: '${originalLocale}'`)
            // id without extension and dirname as in source map
            const idForOrigin = id.replace(/\\/g, '/')
            lines.push(`  id: '${idForOrigin.replace(/\.md$/, '')}'`)
          }
          newFm = insertField(newFm, lines)
          // add change_log entry describing the automated action
          const today = new Date().toISOString().slice(0,10)
          const entry = [`date: ${today}`, `author: 'script:auto-mark-translated'`, `summary: 'Marked as translated and set translation_origin (auto mark)'`, `type: 'meta',`, `locale: '${locale}'`]
          newFm = appendChangeLog(newFm, entry)
          fs.writeFileSync(p, newFm + rest, 'utf8')
          updatedCount++
        }
      } catch (err) {
        console.error('error reading translation', p, err.message)
      }
    }
  }
}

console.log(`Updated ${updatedCount} files (added translation_status/translation_origin to translated pairs). Script: auto-mark-translated.js`)
process.exit(0)

/** Helpers for change_log insertion **/
function appendChangeLog(fm, entryLines) {
  if (!fm) return insertField(null, ['change_log:', '  - ' + entryLines[0], ...entryLines.slice(1).map(l => '    ' + l)])
  if (/^change_log\s*:/m.test(fm)) {
    const indented = entryLines.map(l => '  ' + l)
    return insertField(fm, indented)
  }
  const block = ['change_log:', '  - ' + entryLines[0], ...entryLines.slice(1).map(l => '    ' + l)]
  return insertField(fm, block)
}
