#!/usr/bin/env node
/**
 * set-translation-status.js
 *
 * Small helper to set `translation_status` on one or more Markdown files.
 * It is intentionally dependency-free and uses a conservative frontmatter
 * manipulation approach so it's safe to run on many files.
 *
 * Usage:
 *   node ./scripts/set-translation-status.js <status> <file1> [file2 ...]
 *
 * Example:
 *   node ./scripts/set-translation-status.js original src/content/blog/es/foo.md
 */
import * as fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

if (process.argv.length < 4) {
  console.error('Usage: node set-translation-status.js <status> <file1> [file2 ...]')
  process.exit(2)
}

const status = process.argv[2]
const files = process.argv.slice(3)

/**
 * Ensure the file has a frontmatter block. If absent, create an empty one.
 * @param {string} content
 * @returns {string}
 */
function ensureFrontmatter(content) {
  if (content.startsWith('---')) return content
  return `---\n---\n\n${content}`
}

/**
 * Set or insert the translation_status field in the frontmatter block.
 * @param {string} content
 * @param {string} status
 * @returns {string}
 */
function setStatus(content, status) {
  content = ensureFrontmatter(content)
  const endIdx = content.indexOf('\n---', 3)
  const fmEnd = endIdx === -1 ? content.length : endIdx + 4
  const fm = content.slice(0, fmEnd)
  const rest = content.slice(fmEnd)

  if (/translation_status\s*:\s*/.test(fm)) {
    // replace existing
    let newFm = fm.replace(/translation_status\s*:\s*.*(?:\n|$)/, `translation_status: '${status}'\n`)
    // append change_log entry about this action
    const today = new Date().toISOString().slice(0,10)
    const entry = [`date: ${today}`, `author: 'script:set-translation-status'`, `summary: 'translation_status set to ${status} (manual script)'`, `type: 'meta'`]
    newFm = appendChangeLog(newFm, entry)
    return newFm + rest
  }

  // insert before closing ---
  if (fm.endsWith('\n---\n') || fm.endsWith('\n---')) {
    const insertPos = fm.lastIndexOf('\n---')
    const before = fm.slice(0, insertPos)
    const after = fm.slice(insertPos)
    let newFm = before + `\ntranslation_status: '${status}'` + after + rest
    const today = new Date().toISOString().slice(0,10)
    const entry = [`date: ${today}`, `author: 'script:set-translation-status'`, `summary: 'translation_status set to ${status} (manual script)'`, `type: 'meta'`]
    newFm = appendChangeLog(newFm, entry)
    return newFm
  }

  // fallback: append at start
  let newFm = fm + `\ntranslation_status: '${status}'\n` + rest
  const today = new Date().toISOString().slice(0,10)
  const entry = [`date: ${today}`, `author: 'script:set-translation-status'`, `summary: 'translation_status set to ${status} (manual script)'`, `type: 'meta'`]
  newFm = appendChangeLog(newFm, entry)
  return newFm
}

function appendChangeLog(fm, entryLines) {
  if (!fm) return insertField(null, ['change_log:', '  - ' + entryLines[0], ...entryLines.slice(1).map(l => '    ' + l)])
  if (/^change_log\s*:/m.test(fm)) {
    const indented = entryLines.map(l => '  ' + l)
    return insertField(fm, indented)
  }
  const block = ['change_log:', '  - ' + entryLines[0], ...entryLines.slice(1).map(l => '    ' + l)]
  return insertField(fm, block)
}

for (const f of files) {
  try {
    const abs = path.isAbsolute(f) ? f : path.join(process.cwd(), f)
    const c = fs.readFileSync(abs, 'utf8')
    const updated = setStatus(c, status)
    fs.writeFileSync(abs, updated, 'utf8')
    console.log('Updated', f)
  } catch (err) {
    console.error('Error processing', f, err.message)
  }
}
