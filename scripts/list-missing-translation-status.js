#!/usr/bin/env node
/**
 * list-missing-translation-status.js
 *
 * Small utility to list Markdown files under `src/content/` that are missing
 * the `translation_status` frontmatter key.
 *
 * This file is written as an ES module. It intentionally uses plain Node APIs
 * and simple frontmatter detection to avoid extra dependencies.
 *
 * Usage:
 *   node ./scripts/list-missing-translation-status.js
 *
 * Output:
 *   Prints a count of files and a newline-separated list of relative paths.
 */
import * as fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..')
const contentDir = path.join(root, 'src', 'content')

/**
 * Recursively list .md files under a directory.
 * @param {string} dir - Absolute directory path
 * @returns {string[]} Absolute file paths
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
 * Detect whether the provided file content has `translation_status` in the
 * frontmatter. This is a conservative, dependency-free parser suitable for
 * quick audits.
 * @param {string} content - file contents
 * @returns {boolean}
 */
function hasTranslationStatus(content) {
  // crude frontmatter check: look for `translation_status:` in the frontmatter block
  if (!content.startsWith('---')) return false
  const end = content.indexOf('\n---', 3)
  const fm = end === -1 ? content : content.slice(0, end + 4)
  return /translation_status\s*:\s*/.test(fm)
}

const files = listMdFiles(contentDir)
const missing = []
for (const f of files) {
    try {
    const c = fs.readFileSync(f, 'utf8')
    if (!hasTranslationStatus(c)) missing.push(path.relative(root, f))
  } catch (err) {
    console.error('error reading', f, err.message)
  }
}

console.log(`Found ${files.length} markdown files under src/content/`)
console.log(`Files missing translation_status: ${missing.length}`)
if (missing.length) {
  console.log('\nList:')
  missing.forEach(x => console.log(x))
}
process.exit(0)
