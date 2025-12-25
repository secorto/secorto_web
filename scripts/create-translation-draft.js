#!/usr/bin/env node
// Usage: node create-translation-draft.js <collection> <localeFrom> <id> <targetLocale>
// Example: node create-translation-draft.js talk es 2018-09-17-patrones-automatizacion-pruebas en

const fs = require('fs')
const path = require('path')

const [,, collection, localeFrom, id, targetLocale] = process.argv
if (!collection || !localeFrom || !id || !targetLocale) {
  console.error('Usage: create-translation-draft.js <collection> <localeFrom> <id> <targetLocale>')
  process.exit(2)
}

const base = path.resolve(__dirname, '..')
const srcFile = path.join(base, 'src', 'content', collection, localeFrom, `${id}.md`)
const destDir = path.join(base, 'src', 'content', collection, targetLocale)
const destFile = path.join(destDir, `${id}.md`)

if (!fs.existsSync(srcFile)) {
  console.error('Source file does not exist:', srcFile)
  process.exit(1)
}

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true })
}

if (fs.existsSync(destFile)) {
  console.error('Target file already exists:', destFile)
  process.exit(1)
}

let content = fs.readFileSync(srcFile, 'utf8')

// Find frontmatter --- boundaries
const fmStart = content.indexOf('---')
if (fmStart !== 0) {
  console.error('Source file does not start with frontmatter ---')
  // still copy but warn
}
const fmEnd = content.indexOf('---', fmStart + 3)
let fm = ''
let body = content
if (fmStart === 0 && fmEnd > fmStart) {
  fm = content.slice(fmStart + 3, fmEnd).trim()
  body = content.slice(fmEnd + 3)
}

// Build new frontmatter: preserve existing keys and add translation fields
let fmLines = fm.split(/\r?\n/).filter(Boolean)
// add translation_status and translation_origin
fmLines.push(`translation_status: 'draft'`)
fmLines.push(`translation_origin:`)
fmLines.push(`  locale: '${localeFrom}'`)
fmLines.push(`  id: '${id}'`)

const newFm = '---\n' + fmLines.join('\n') + '\n---\n\n'
const newContent = newFm + body
fs.writeFileSync(destFile, newContent, 'utf8')
console.log('Created translation draft:', destFile)
