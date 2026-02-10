import { test, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

import { buildContentMap } from '@scripts/lib/content-utils.js'
import { findInconsistenciesFromMap } from '@scripts/lib/consistency-checks.js'

test('detects translation inconsistencies from file map', async () => {
  const base = path.join(process.cwd(), 'tests', 'tmp-content')
  // create small content tree
  fs.mkdirSync(path.join(base, 'blog', 'en'), { recursive: true })
  fs.mkdirSync(path.join(base, 'blog', 'es'), { recursive: true })
  fs.mkdirSync(path.join(base, 'work', 'en'), { recursive: true })
  fs.mkdirSync(path.join(base, 'work', 'es'), { recursive: true })

  fs.writeFileSync(path.join(base, 'blog', 'en', 'por-que-uso-npm.md'), `---\ntitle: Why I use npm\ndate: 2025-12-26\ntranslation_status: 'translated'\n---\n`)
  fs.writeFileSync(path.join(base, 'blog', 'es', 'por-que-uso-npm.md'), `---\ntitle: Por qué uso npm\ndate: 2025-12-26\ntranslation_status: 'original'\n---\n`)
  fs.writeFileSync(path.join(base, 'work', 'en', 'perficient.md'), `---\ntitle: Perficient\nstartDate: 2018-04-01\ntranslation_status: 'original'\ntranslation_origin:\n  locale: 'es'\n  id: 'perficient'\n---\n`)
  fs.writeFileSync(path.join(base, 'work', 'es', 'perficient.md'), `---\ntitle: Perficient ES\nstartDate: 2018-04-01\ntranslation_status: 'original'\n---\n`)

  try {
    const map = buildContentMap(base)
    const issues = findInconsistenciesFromMap(map)

    expect(issues.some(i => i.type === 'translated_missing_origin' && i.collection === 'blog')).toBe(true)
    expect(issues.some(i => i.type === 'origin_present_both_original' && i.collection === 'work')).toBe(true)
  } finally {
    fs.rmSync(base, { recursive: true, force: true })
  }
})
