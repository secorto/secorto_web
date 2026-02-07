#!/usr/bin/env node
import fs from 'fs'
import { fileURLToPath } from 'url'
import { listDeploys } from '../lib/wait-netlify-api.js'
import { previewDeploysForBranch, findMatchingDeploy, choosePreviewUrl, summarizeCandidates } from '../lib/wait-netlify-integrator.js'

const maxAttempts = 30
const delayMs = 10000

const token = process.env.NETLIFY_AUTH_TOKEN
const site = process.env.NETLIFY_SITE_ID

function resolveEnvBranch() {
  if (process.env.PR_BRANCH) return process.env.PR_BRANCH
  if (process.env.GITHUB_REF_NAME) return process.env.GITHUB_REF_NAME
  const ref = process.env.GITHUB_REF
  if (ref && ref.startsWith('refs/heads/')) return ref.replace('refs/heads/', '')
  return null
}

const branch = resolveEnvBranch()
const envFile = process.env.GITHUB_ENV

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

function ensureFetch() {
  if (typeof fetch === 'function') return
  throw new Error('Global fetch not available (requires Node 18+)')
}

function resolveExpectedSha() {
  if (process.env.PR_HEAD_COMMIT_SHA) return process.env.PR_HEAD_COMMIT_SHA
  return null
}


const wait = ms => new Promise(r => setTimeout(r, ms))

function writePreviewUrl(url) {
  console.log(`NETLIFY_PREVIEW_URL=${url}`)
  return fs.appendFileSync(envFile, `NETLIFY_PREVIEW_URL=${url}\n`)
}

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
 * @param {object} opts
 * @returns {Promise<{code: number, url: string|null, lastSeen: Array}>}
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
