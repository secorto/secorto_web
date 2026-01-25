#!/usr/bin/env node
/**
 * wait-netlify.js
 *
 * Poll Netlify Deploys for a PR preview and write NETLIFY_PREVIEW_URL to GITHUB_ENV
 *
 * Required environment variables (in CI):
 * - NETLIFY_AUTH_TOKEN: Netlify personal access token (least privilege)
 * - NETLIFY_SITE_ID: Netlify site id
 * - PR_BRANCH: branch name for the PR (e.g. from github.head_ref)
 * - GITHUB_ENV: path to file where GitHub Actions reads env vars (provided by runner)
 *
 * Usage (in GitHub Actions):
 *   node .github/scripts/wait-netlify.js
 *
 * Options (CLI):
 *   --attempts=<n>   Number of polling attempts (default 30)
 *   --delay=<ms>     Delay between attempts in ms (default 10000)
 *   --debug          Enable verbose logging to stdout/stderr
 *   --print-only     Print NETLIFY_PREVIEW_URL to stdout instead of writing GITHUB_ENV
 *
 * Debugging locally:
 *  - Export the required env vars and run with --debug to see requests and responses
 *  - Example:
 *      NETLIFY_AUTH_TOKEN=xxx NETLIFY_SITE_ID=yyy PR_BRANCH=feature/abc node .github/scripts/wait-netlify.js --debug --attempts=5
 */

import fs from 'fs'

function parseArg(name, fallback) {
  const match = process.argv.find(a => a.startsWith(`${name}=`))
  if (!match) return fallback
  return match.split('=')[1]
}

const DEBUG = process.argv.includes('--debug') || String(process.env.DEBUG || '').toLowerCase() === '1' || String(process.env.DEBUG || '').toLowerCase() === 'true'
const PRINT_ONLY = process.argv.includes('--print-only')
const maxAttempts = parseInt(parseArg('--attempts', '30'), 10)
const delayMs = parseInt(parseArg('--delay', '10000'), 10)

const token = process.env.NETLIFY_AUTH_TOKEN
const site = process.env.NETLIFY_SITE_ID
const branch = process.env.PR_BRANCH
const envFile = process.env.GITHUB_ENV
const expectedSha = process.env.GITHUB_SHA || process.env.PR_COMMIT_SHA || null
const cliExpected = parseArg('--expected-sha', null)

// Resolve expected SHA and its source with a single helper (priority: CLI, env PR_HEAD_SHA, env GITHUB_SHA, event payload)
function resolveExpectedSha() {
  if (cliExpected) return { sha: cliExpected, source: 'cli(--expected-sha)' }
  if (process.env.PR_HEAD_SHA) return { sha: process.env.PR_HEAD_SHA, source: 'env(PR_HEAD_SHA)' }
  if (expectedSha) return { sha: expectedSha, source: 'env(GITHUB_SHA|PR_COMMIT_SHA)' }
  if (process.env.GITHUB_EVENT_PATH) {
    try {
      const ev = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'))
      const prHeadSha = ev?.pull_request?.head?.sha
      if (prHeadSha) return { sha: prHeadSha, source: 'GITHUB_EVENT_PATH.pull_request.head.sha' }
    } catch (e) {
      if (DEBUG) console.error('Could not read/parse GITHUB_EVENT_PATH:', e && e.message ? e.message : e)
    }
  }
  return { sha: null, source: null }
}

// Validate required env vars
const required = [{ k: 'NETLIFY_AUTH_TOKEN', v: token }, { k: 'NETLIFY_SITE_ID', v: site }, { k: 'PR_BRANCH', v: branch }]
const missing = required.filter(r => !r.v).map(r => r.k)
if (missing.length) {
  console.error('Missing required env var(s):', missing.join(', '))
  console.error('Set them in your workflow or export locally before running:')
  console.error('  NETLIFY_AUTH_TOKEN=... NETLIFY_SITE_ID=... PR_BRANCH=... node .github/scripts/wait-netlify.js')
  process.exit(1)
}

async function ensureFetch() {
  if (typeof fetch === 'function') return fetch
  try {
    const mod = await import('node-fetch')
    return mod.default || mod
  } catch (e) {
    console.error('Global fetch not available and node-fetch not installed. Require Node 18+ or add node-fetch as dependency.')
    process.exit(1)
  }
}

const wait = ms => new Promise(r => setTimeout(r, ms))

/**
 * Fetch Netlify site information (production URL)
 */
async function fetchSiteInfo(_fetch, siteId, token) {
  try {
    const siteRes = await _fetch(`https://api.netlify.com/api/v1/sites/${siteId}`, {
      headers: { Authorization: 'Bearer ' + token }
    })
    if (!siteRes.ok) {
      if (DEBUG) console.error('Failed to fetch site info', siteRes.status, siteRes.statusText)
      return null
    }
    const siteInfo = await siteRes.json()
    return siteInfo && (siteInfo.ssl_url || siteInfo.url) || null
  } catch (e) {
    if (DEBUG) console.error('Error fetching site info:', e && e.message ? e.message : e)
    return null
  }
}

/**
 * List recent deploys (JSON array)
 */
async function listDeploys(_fetch, siteId, token) {
  const res = await _fetch(`https://api.netlify.com/api/v1/sites/${siteId}/deploys?per_page=20`, {
    headers: { Authorization: 'Bearer ' + token }
  })
  if (!res.ok) throw new Error(`Netlify API status ${res.status}`)
  return res.json()
}

/**
 * Extract a probable commit SHA from common deploy fields and report which field contained it
 * @returns {{sha: string|null, field: string|null}}
 */
function extractShaFromDeploy(deploy) {
  if (!deploy) return { sha: null, field: null }
  const fields = [
    ['commit_ref', deploy.commit_ref],
    ['commit_url', deploy.commit_url],
    ['commit_message', deploy.commit_message],
    ['sha', deploy.sha],
    ['commit_sha', deploy.commit_sha],
    ['title', deploy.title]
  ]
  for (const [field, value] of fields) {
    if (!value) continue
    const m = String(value).match(/[0-9a-f]{7,40}/i)
    if (m) return { sha: String(m[0]).trim().toLowerCase(), field }
  }
  return { sha: null, field: null }
}

function previewDeploysForBranch(deploys, branchName) {
  if (!Array.isArray(deploys)) return []
  return deploys
    .filter(d => d && d.context === 'deploy-preview' && d.branch === branchName)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
}

// Note: production URL check removed — we already filter by deploy context ('deploy-preview')

function deployMatchesCriteria(deploy, expectedSha) {
  if (!deploy) return false
  const url = deploy.ssl_url || deploy.url || null
  const state = deploy.state
  if (state !== 'ready') return false
  if (!expectedSha) return true
  const { sha: deploySha } = extractShaFromDeploy(deploy)
  if (!deploySha) return false
  const expected = String(expectedSha).trim().toLowerCase()
  // If expected SHA looks like a full 40-char SHA, compare full; otherwise compare prefix
  if (expected.length >= 40) return deploySha === expected
  const n = Math.min(7, expected.length)
  return deploySha.slice(0, n) === expected.slice(0, n)
}

/**
 * Find the first deploy that matches expected SHA and not production.
 * Logs per-candidate comparison when DEBUG.
 */
function findMatchingDeploy(candidates, expectedSha) {
  if (!Array.isArray(candidates) || candidates.length === 0) return null
  const expected = expectedSha ? String(expectedSha).trim().toLowerCase() : null
  for (const d of candidates) {
    const url = d.ssl_url || d.url || null
    if (d.state !== 'ready') {
      if (DEBUG) console.error(`skip ${d.id}: state=${d.state}`)
      continue
    }
    // note: do not discard by URL; we already filtered by deploy context
    const { sha: deploySha, field } = extractShaFromDeploy(d)
    if (DEBUG) console.error(`compare ${d.id}: deploySha=${deploySha} (from ${field}), expected=${expected}`)
    if (!expected) return d
    if (!deploySha) continue
    if (expected.length >= 40) {
      if (deploySha === expected) return d
    } else {
      const n = Math.min(7, expected.length)
      if (deploySha.slice(0, n) === expected.slice(0, n)) return d
    }
  }
  return null
}

function writePreviewUrl(url) {
  if (PRINT_ONLY) return void console.log(url)
  if (envFile) {
    fs.appendFileSync(envFile, `NETLIFY_PREVIEW_URL=${url}\n`)
    if (DEBUG) console.error(`Wrote NETLIFY_PREVIEW_URL to ${envFile}`)
    return
  }
  console.log(`NETLIFY_PREVIEW_URL=${url}`)
}

;(async () => {
  const _fetch = await ensureFetch()

  const { sha: resolvedSha, source: resolvedSource } = resolveExpectedSha()
  if (resolvedSha) console.error(`Using expected SHA (${resolvedSource}): ${resolvedSha}`)
  else if (DEBUG) console.error('No expected SHA provided; will accept the first ready preview that is not production')

  let lastSeen = []
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      if (DEBUG) console.error(`Attempt ${attempt}/${maxAttempts}: fetching deploys for ${site}`)
      const all = await listDeploys(_fetch, site, token)
      if (DEBUG) console.error('Received deploys count:', Array.isArray(all) ? all.length : 'unknown')

      const candidates = previewDeploysForBranch(all, branch)
      lastSeen = candidates.map(d => {
        const { sha, field } = extractShaFromDeploy(d)
        return { id: d && d.id, sha, field, state: d && d.state }
      })
      if (DEBUG) console.error('Preview candidates (top 5):', JSON.stringify(lastSeen.slice(0, 5), null, 2))

      const matching = findMatchingDeploy(candidates, resolvedSha)
      if (matching) {
        // Log the full deploy object only when DEBUG; always print a concise FOUND MATCH summary
        if (DEBUG) console.error('FOUND MATCH deploy object:', JSON.stringify(matching, null, 2))
        // Prefer Netlify preview links if present (links.permalink or links.alias), fallback to ssl_url/url
        const url = (matching.links && (matching.links.permalink || matching.links.alias)) || matching.ssl_url || matching.url
        const chosenField = matching.links && (matching.links.permalink ? 'links.permalink' : matching.links.alias ? 'links.alias' : null) || (matching.ssl_url ? 'ssl_url' : 'url')
        const { sha: matchedSha, field: matchedField } = extractShaFromDeploy(matching)
        console.error(`FOUND MATCH: deploy id=${matching.id} sha=${matchedSha} field=${matchedField} chosenUrlField=${chosenField} url=${url}`)
        writePreviewUrl(url)
        process.exit(0)
      }

      if (DEBUG) console.error('No matching preview deploy found yet; retrying')
    } catch (err) {
      console.error('Error while checking deploys:', err && err.message ? err.message : err)
    }
    if (attempt < maxAttempts) await wait(delayMs)
  }

  console.error('Timed out waiting for Netlify preview deploy')
  if (resolvedSha) {
    console.error(`Expected commit SHA: ${resolvedSha.slice(0, 7)}`)
    console.error('NO MATCH FOUND for expected SHA')
  }
  if (DEBUG && lastSeen && lastSeen.length) console.error('Last seen deploys (id/sha/state):', JSON.stringify(lastSeen.slice(0, 5), null, 2))
  process.exit(1)
})()
