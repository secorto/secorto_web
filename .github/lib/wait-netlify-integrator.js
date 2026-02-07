import { extractShaFromDeploy } from './wait-netlify-git.js'

// @ts-check
/**
 * @typedef {Object} Deploy
 * @property {number|string} id
 * @property {string} [branch]
 * @property {string} [state]
 * @property {string} [created_at]
 * @property {string} [ssl_url]
 * @property {string} [url]
 * @property {Object} [links]
 * @property {string} [context]
 */

const FULL_SHA_LENGTH = 40
const MIN_PREFIX_MATCH = 7

function summarizeCandidates(candidates) {
  return candidates.map(d => {
    const { sha, field } = extractShaFromDeploy(d)
    return { id: d && d.id, sha, field, state: d && d.state }
  })
}

/**
 * Filter deploys to those matching a branch and sort newest first
 * @param {Deploy[]} deploys
 * @param {string} branchName
 * @returns {Deploy[]}
 */
function previewDeploysForBranch(deploys, branchName) {
  return deploys
    .filter(d => {
      // normal PR previews: match deploy-preview + branch
      if (d.context === 'deploy-preview' && d.branch === branchName) return true
      // allow running on main/master: accept production deploys (branch may be absent)
      if ((branchName === 'main' || branchName === 'master') && d.context === 'production') {
        if (!d.branch) return true
        return d.branch === branchName
      }
      return false
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
}

/**
 * Is a deploy considered ready
 * @param {Deploy|any} deploy
 * @returns {boolean}
 */
function isReady(deploy) {
  return deploy && deploy.state === 'ready'
}

/**
 * Compare candidate SHA to expected. Allow prefix matching for expected >=7 chars
 * @param {string|null} deploySha
 * @param {string|null} expected
 * @returns {boolean}
 */
function matchesSha(deploySha, expected) {
  if (!deploySha) return false
  // If no expected SHA provided, treat as not matching (fail fast)
  if (!expected) return false
  const exp = String(expected).trim().toLowerCase()
  const dep = String(deploySha).trim().toLowerCase()
  // if both look like full SHAs, require exact match
  if (exp.length >= FULL_SHA_LENGTH && dep.length >= FULL_SHA_LENGTH) return dep === exp
  // otherwise compare by a safe prefix: at least MIN_PREFIX_MATCH, up to available length
  const prefixLen = Math.max(MIN_PREFIX_MATCH, Math.min(exp.length, dep.length))
  return dep.slice(0, prefixLen) === exp.slice(0, prefixLen)
}

/**
 * Find the first ready deploy matching expected SHA
 * @param {Deploy[]|any[]} candidates
 * @param {string|null|undefined} expectedSha
 * @returns {Deploy|null}
 */
function findMatchingDeploy(candidates, expectedSha) {
  if (!Array.isArray(candidates) || candidates.length === 0) return null
  const expected = expectedSha ? String(expectedSha).trim().toLowerCase() : null
  for (const deploy of candidates) {
    if (!isReady(deploy)) continue
    const { sha: deploySha } = extractShaFromDeploy(deploy)
    if (matchesSha(deploySha, expected)) return deploy
  }
  return null
}

/**
 * Choose a URL from a matching deploy prioritizing permalink/alias
 * @param {Deploy|any} matching
 * @returns {{url:string|null, chosenField:string|null}}
 */
function choosePreviewUrl(matching) {
  const links = matching.links || {}
  if (links.permalink) return { url: links.permalink, chosenField: 'links.permalink' }
  if (links.alias) return { url: links.alias, chosenField: 'links.alias' }
  if (matching.ssl_url) return { url: matching.ssl_url, chosenField: 'ssl_url' }
  if (matching.url) return { url: matching.url, chosenField: 'url' }
  throw new Error('no preview url available on deploy')
}

export { previewDeploysForBranch, findMatchingDeploy, choosePreviewUrl, summarizeCandidates }
