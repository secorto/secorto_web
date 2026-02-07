#!/usr/bin/env node
import fs from 'fs'
import { fileURLToPath } from 'url'
import { listDeploys } from '../lib/wait-netlify-api.js'
import { previewDeploysForBranch, findMatchingDeploy, choosePreviewUrl, summarizeCandidates } from '../lib/wait-netlify-integrator.js'

const maxAttempts = 30
const delayMs = 10000

const token = process.env.NETLIFY_AUTH_TOKEN
const site = process.env.NETLIFY_SITE_ID

// JSDoc typedefs for runtime helpers
/**
 * @typedef {Object} PollForPreviewOptions
 * @property {(site:string, token:string) => Promise<any[]>} listDeploysFn
 * @property {string} site
 * @property {string} token
 * @property {string} branch
 * @property {string|null|undefined} [expectedSha]
 * @property {number} [attempts]
 * @property {number} [delayMs]
 * @property {(url:string) => Promise<void>|void} writeUrlFn
 */

/**
 * @typedef {{code:number, url:string|null, lastSeen:Array}} PollResult
 */

/**
 * Resolve the branch name from CI-provided vars.
 * @returns {string|null} branch name or null when not determinable
 */
function resolveEnvBranch() {
  if (process.env.PR_BRANCH) return process.env.PR_BRANCH
  if (process.env.GITHUB_REF_NAME) return process.env.GITHUB_REF_NAME
  const ref = process.env.GITHUB_REF
  if (ref && ref.startsWith('refs/heads/')) return ref.replace('refs/heads/', '')
  return null
}

const branch = resolveEnvBranch()
const envFile = process.env.GITHUB_ENV

/**
 * Ensure required environment variables are present.
 * @throws {Error} when required env vars are missing
 */
function ensureEnv() {
  const missing = []
  if (!token) missing.push('NETLIFY_AUTH_TOKEN')
  if (!site) missing.push('NETLIFY_SITE_ID')
  if (!branch) missing.push('branch (PR_BRANCH or GITHUB_REF_NAME)')
  if (!envFile) missing.push('GITHUB_ENV')

  if (missing.length) {
    throw new Error('Missing env: ' + missing.join(', '))
  }
}

/**
 * Ensure a global `fetch` implementation is available.
 * @throws {Error} when `fetch` is not available
 */
function ensureFetch() {
  if (typeof fetch === 'function') return
  throw new Error('Global fetch not available (requires Node 18+)')
}

/**
 * Resolve the expected commit SHA to match against Netlify deploys.
 * The workflow should provide `COMMIT_ID` (PR head sha or push sha).
 * Accepted format: hex-like string, between 7 and 40 hex characters (prefix or full sha).
 * Returns the normalized (trimmed, lowercase) value or `null` if not present/invalid.
 * @returns {string|null}
 */
function resolveExpectedSha() {
  const v = process.env.COMMIT_ID
  if (v && /^[0-9a-f]{7,40}$/i.test(v)) return String(v).trim().toLowerCase()
  return null
}


const wait = ms => new Promise(r => setTimeout(r, ms))

/**
 * Write the chosen preview URL into the GitHub Actions env file.
 * @param {string} url
 * @returns {void}
 */
function writePreviewUrl(url) {
  console.log(`NETLIFY_PREVIEW_URL=${url}`)
  fs.appendFileSync(envFile, `NETLIFY_PREVIEW_URL=${url}\n`)
}

/**
 * Entrypoint when executed directly. Performs environment checks and polls Netlify.
 * @returns {Promise<number>} exit code (0 success, 1 timeout)
 */
export async function main() {
  try {
    ensureEnv()
    ensureFetch()
  } catch (err) {
    console.error(err)
    process.exit(1)
  }

  const expectedSha = resolveExpectedSha()

  const result = await pollForPreview({
    listDeploysFn: listDeploys,
    site,
    token,
    branch,
    expectedSha,
    attempts: maxAttempts,
    delayMs,
    writeUrlFn: writePreviewUrl
  })

  return result.code
}

// If executed directly, run main and set exit code. If imported, users can call `main()`.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().then(code => process.exit(code || 0)).catch(err => {
    console.error('fatal:', err && err.message ? err.message : err)
    process.exit(1)
  })
}

/**
 * Poll Netlify deploys until a matching preview is found or attempts exhausted.
 * Dependencies are injected to aid testing.
 * @param {PollForPreviewOptions} opts
 * @returns {Promise<PollResult>}
 */
export async function pollForPreview({
  listDeploysFn,
  site,
  token,
  branch,
  expectedSha = null,
  attempts = 30,
  delayMs = 10000,
  writeUrlFn
}) {
  let lastSeen = []
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const all = await listDeploysFn(site, token)
      const candidates = previewDeploysForBranch(all, branch)
      lastSeen = summarizeCandidates(candidates)
      const matching = findMatchingDeploy(candidates, expectedSha)
      if (matching) {
        const { url } = choosePreviewUrl(matching)
        if (url) {
          await writeUrlFn(url)
          return { code: 0, url, lastSeen }
        }
      }
    } catch (err) {
      // bubble error info in lastSeen/console for easier debugging in tests
      console.error('error while polling:', err && err.message ? err.message : err)
    }
    if (attempt < attempts) await wait(delayMs)
  }
  return { code: 1, url: null, lastSeen }
}

// export helper for tests
export { resolveEnvBranch, ensureEnv, writePreviewUrl, resolveExpectedSha }
