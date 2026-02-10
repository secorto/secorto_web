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
import path from 'path'

const contentDir = path.join(process.cwd(), 'src', 'content')

// content parsing and checks are delegated to `scripts/lib/*`

import { buildContentMap } from './lib/content-utils.js'
import { findInconsistenciesFromMap } from './lib/consistency-checks.js'

const map = buildContentMap(contentDir)
const inconsistencies = findInconsistenciesFromMap(map)

if (inconsistencies.length === 0) {
  console.log('No inconsistencies found — looks good')
  process.exit(0)
}

console.log(`Found ${inconsistencies.length} inconsistency(ies):`)
for (const inc of inconsistencies) {
  console.log('-', inc)
}

process.exit(1)
