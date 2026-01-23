#!/usr/bin/env node
/**
 * migrate-updated-to-changelog.js
 *
 * Convert existing `updated` (and optional `change_summary`) frontmatter
 * into a `change_log` array entry when missing. Keeps `updated` as a
 * derived field (set to the last change_log entry date) to preserve
 * compatibility with templates.
 *
 * Usage:
 *   node ./scripts/migrate-updated-to-changelog.js
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..')
const contentDir = path.join(root, 'src', 'content')

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

function readFrontmatter(content) {
  if (!content.startsWith('---')) return { fm: null, rest: content }
  const end = content.indexOf('\n---', 3)
  if (end === -1) return { fm: content, rest: '' }
  const fm = content.slice(0, end + 4)
  const rest = content.slice(end + 4)
  return { fm, rest }
}

function hasField(fm, field) {
  if (!fm) return false
  const re = new RegExp(`^${field}\\s*:\\s*`, 'm')
  return re.test(fm)
}

function insertField(fm, fieldLines) {
  if (!fm) return `---\n${fieldLines.join('\n')}\n---\n\n`
  const insertPos = fm.lastIndexOf('\n---')
  if (insertPos === -1) return fm + '\n' + fieldLines.join('\n')
  const before = fm.slice(0, insertPos)
  const after = fm.slice(insertPos)
  return before + '\n' + fieldLines.join('\n') + after
}

function appendChangeLog(fm, entryLines) {
  if (!fm) return insertField(null, ['change_log:', '  - ' + entryLines[0], ...entryLines.slice(1).map(l => '    ' + l)])
  if (/^change_log\s*:/m.test(fm)) {
    // append indented entry so it becomes part of the existing change_log
    const indented = entryLines.map(l => '  ' + l)
    return insertField(fm, indented)
  }
  // no change_log present, create one
  const block = ['change_log:', '  - ' + entryLines[0], ...entryLines.slice(1).map(l => '    ' + l)]
  return insertField(fm, block)
}

const files = listMdFiles(contentDir)
let modified = 0
for (const f of files) {
  try {
    const content = fs.readFileSync(f, 'utf8')
    const { fm, rest } = readFrontmatter(content)
    const hasChangeLog = hasField(fm, 'change_log')
    const hasUpdated = hasField(fm, 'updated')
    const hasChangeSummary = hasField(fm, 'change_summary')

    if (!hasChangeLog && !hasUpdated && !hasChangeSummary) continue

    // if no change_log, create one from updated or change_summary
    let newFm = fm
    if (!hasChangeLog) {
      // extract updated value
      let updatedVal = null
      if (hasUpdated) {
        const m = fm.match(/^updated\s*:\s*(.+)$/m)
        if (m) updatedVal = m[1].trim()
      }
      // remove optional surrounding quotes
      if (updatedVal && updatedVal.startsWith("'") && updatedVal.endsWith("'")) {
        updatedVal = updatedVal.slice(1, -1)
      }
      if (!updatedVal) {
        // fallback to today's date
        updatedVal = new Date().toISOString().slice(0,10)
      }
      // summary
      let summary = null
      if (hasChangeSummary) {
        const m = fm.match(/^change_summary\s*:\s*(.+)$/m)
        if (m) summary = m[1].trim()
        if (summary && summary.startsWith("'") && summary.endsWith("'")) summary = summary.slice(1,-1)
      }
      if (!summary) summary = `Migrated from updated (${updatedVal})`

      const entryLines = [`date: ${updatedVal}`, `author: 'script:migrate-updated-to-changelog'`, `summary: '${summary.replace(/'/g, "'\\''")}'`, `type: 'meta'`]
      newFm = appendChangeLog(fm, entryLines)
      // ensure updated remains present as-is to preserve compatibility
    } else {
      // if change_log exists, ensure updated matches last change date (best-effort)
      const m = fm.match(/change_log:\s*[\s\S]*?date:\s*(\d{4}-\d{2}-\d{2})/m)
      if (m) {
        const lastDate = m[1]
        if (!hasUpdated || (hasUpdated && !new RegExp(`updated\\s*:\\s*${lastDate}`).test(fm))) {
          // insert/update updated
          const updatedLine = `updated: ${lastDate}`
          if (hasUpdated) {
            newFm = fm.replace(/updated\s*:\s*.*(?:\n|$)/, `${updatedLine}\n`)
          } else {
            newFm = insertField(fm, [updatedLine])
          }
        }
      }
    }

    if (newFm !== fm) {
      fs.writeFileSync(f, newFm + rest, 'utf8')
      modified++
      console.log('Migrated', f)
    }
  } catch (err) {
    console.error('Error processing', f, err.message)
  }
}

console.log(`Migration finished. Files modified: ${modified}`)
process.exit(0)
