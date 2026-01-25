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

const DEBUG = process.argv.includes('--debug')
const PRINT_ONLY = process.argv.includes('--print-only')
const maxAttempts = parseInt(parseArg('--attempts', '30'), 10)
const delayMs = parseInt(parseArg('--delay', '10000'), 10)

const token = process.env.NETLIFY_AUTH_TOKEN
const site = process.env.NETLIFY_SITE_ID
const branch = process.env.PR_BRANCH
const envFile = process.env.GITHUB_ENV
const expectedSha = process.env.GITHUB_SHA || process.env.PR_COMMIT_SHA || null

const missing = []
if (!token) missing.push('NETLIFY_AUTH_TOKEN')
if (!site) missing.push('NETLIFY_SITE_ID')
if (!branch) missing.push('PR_BRANCH')
if (missing.length) {
  console.error('Missing required env var(s):', missing.join(', '))
  console.error('Set them in your workflow (see .github/workflows/playwright.yml) or export locally before running:')
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
 * Extract a probable commit SHA from common deploy fields
 */
function extractShaFromDeploy(deploy) {
  if (!deploy) return null
  const candidates = [deploy.commit_ref, deploy.commit_url, deploy.commit_message, deploy.sha, deploy.commit_sha, deploy.title]
  for (const c of candidates) {
    if (!c) continue
    const m = String(c).match(/[0-9a-f]{7,40}/i)
    if (m) return m[0]
  }
  return null
}

function previewDeploysForBranch(deploys, branchName) {
  if (!Array.isArray(deploys)) return []
  return deploys
    .filter(d => d && d.context === 'deploy-preview' && d.branch === branchName)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
}

function isProdUrl(url, prodUrl) {
  if (!url || !prodUrl) return false
  return url.replace(/\/$/, '') === prodUrl.replace(/\/$/, '')
}

function deployMatchesCriteria(deploy, expectedSha, prodUrl) {
  if (!deploy) return false
  const url = deploy.ssl_url || deploy.url || null
  const state = deploy.state
  if (state !== 'ready') return false
  if (isProdUrl(url, prodUrl)) return false
  if (!expectedSha) return true
  const deploySha = extractShaFromDeploy(deploy)
  if (!deploySha) return false
  return deploySha.slice(0, 7) === expectedSha.slice(0, 7)
}

function writePreviewUrl(url) {
  if (PRINT_ONLY) {
    console.log(url)
    return
  }
  if (envFile) {
    fs.appendFileSync(envFile, `NETLIFY_PREVIEW_URL=${url}\n`)
    if (DEBUG) console.error(`Wrote NETLIFY_PREVIEW_URL to ${envFile}`)
    return
  }
  console.log(`NETLIFY_PREVIEW_URL=${url}`)
}

;(async () => {
  const _fetch = await ensureFetch()
  const prodUrl = await fetchSiteInfo(_fetch, site, token)
  if (DEBUG) console.error('Production site url:', prodUrl)

  let lastSeen = []
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      if (DEBUG) console.error(`Attempt ${attempt}/${maxAttempts}: fetching deploys for ${site}`)
      const all = await listDeploys(_fetch, site, token)
      if (DEBUG) console.error('Received deploys count:', Array.isArray(all) ? all.length : 'unknown')

      const candidates = previewDeploysForBranch(all, branch)
      lastSeen = candidates.map(d => ({ id: d && d.id, sha: extractShaFromDeploy(d), state: d && d.state }))
      if (DEBUG) console.error('Preview candidates (top 5):', JSON.stringify(lastSeen.slice(0, 5), null, 2))

      const matching = candidates.find(d => deployMatchesCriteria(d, expectedSha, prodUrl))
      if (matching) {
        const url = matching.ssl_url || matching.url
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
  if (expectedSha) console.error(`Expected commit SHA: ${expectedSha.slice(0, 7)}`)
  if (lastSeen && lastSeen.length) console.error('Last seen deploys (id/sha/state):', JSON.stringify(lastSeen.slice(0, 5), null, 2))
  process.exit(1)
})()
