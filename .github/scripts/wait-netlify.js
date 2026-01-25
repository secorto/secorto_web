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

;(async () => {
  const _fetch = await ensureFetch()
  for (let i = 1; i <= maxAttempts; i++) {
    try {
      if (DEBUG) console.error(`fetching deploys for site=${site} (attempt ${i}/${maxAttempts})`)
      const res = await _fetch(`https://api.netlify.com/api/v1/sites/${site}/deploys?per_page=20`, {
        headers: { Authorization: 'Bearer ' + token }
      })
      if (!res.ok) {
        if (DEBUG) console.error('Netlify API non-OK response', res.status, res.statusText)
        throw new Error(`Netlify API status ${res.status}`)
      }
      const data = await res.json()
      if (DEBUG) console.error('deploys returned:', JSON.stringify(data && data.slice(0, 5), null, 2))
      const found = Array.isArray(data) && data.find(d => d.context === 'deploy-preview' && d.branch === branch)
      const url = found && (found.ssl_url || found.url)
      const state = found && found.state
      if (url && state === 'ready') {
        if (PRINT_ONLY) {
          console.log(url)
        } else if (envFile) {
          fs.appendFileSync(envFile, `NETLIFY_PREVIEW_URL=${url}\n`)
          if (DEBUG) console.error(`Wrote NETLIFY_PREVIEW_URL to ${envFile}`)
        } else {
          // Fallback if GITHUB_ENV not provided
          console.log(`NETLIFY_PREVIEW_URL=${url}`)
        }
        process.exit(0)
      }
      if (DEBUG) console.error(`Not ready yet (state=${state}), retrying (${i}/${maxAttempts})`)
    } catch (err) {
      console.error('Error fetching Netlify deploys:', err && err.message ? err.message : err)
    }
    if (i < maxAttempts) await wait(delayMs)
  }
  console.error('Timed out waiting for Netlify preview deploy')
  process.exit(1)
})()
