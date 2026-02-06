import { extractShaFromDeploy } from './wait-netlify-git.js'

const FULL_SHA_LENGTH = 40
const MIN_PREFIX_MATCH = 7

function summarizeCandidates(candidates) {
  return candidates.map(d => {
    const { sha, field } = extractShaFromDeploy(d)
    return { id: d && d.id, sha, field, state: d && d.state }
  })
}

function previewDeploysForBranch(deploys, branchName) {
  return deploys
    .filter(d => d && d.context === 'deploy-preview' && d.branch === branchName)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
}

function isReady(deploy) {
  return deploy && deploy.state === 'ready'
}

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

function choosePreviewUrl(matching) {
  const links = matching.links || {}
  if (links.permalink) return { url: links.permalink, chosenField: 'links.permalink' }
  if (links.alias) return { url: links.alias, chosenField: 'links.alias' }
  if (matching.ssl_url) return { url: matching.ssl_url, chosenField: 'ssl_url' }
  if (matching.url) return { url: matching.url, chosenField: 'url' }
  return { url: null, chosenField: null }
}

export { previewDeploysForBranch, findMatchingDeploy, choosePreviewUrl, summarizeCandidates }
