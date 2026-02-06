import { extractShaFromDeploy } from './wait-netlify-git.js'

const FULL_SHA_LENGTH = 40
const MIN_PREFIX_MATCH = 7

function summarizeCandidates(candidates) {
  if (!Array.isArray(candidates)) return []
  return candidates.map(d => {
    const { sha, field } = extractShaFromDeploy(d)
    return { id: d && d.id, sha, field, state: d && d.state }
  })
}

function previewDeploysForBranch(deploys, branchName) {
  if (!Array.isArray(deploys)) return []
  return deploys
    .filter(d => d && d.context === 'deploy-preview' && d.branch === branchName)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
}

function isReady(deploy) {
  return deploy && deploy.state === 'ready'
}

function matchesSha(deploySha, expected) {
  if (!deploySha) return false
  if (!expected) return true
  const exp = String(expected).trim().toLowerCase()
  if (exp.length >= FULL_SHA_LENGTH) return deploySha === exp
  const prefixLen = Math.min(MIN_PREFIX_MATCH, exp.length)
  return deploySha.slice(0, prefixLen) === exp.slice(0, prefixLen)
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
  if (!matching) return { url: null, chosenField: null }
  const links = matching.links || {}
  if (links.permalink) return { url: links.permalink, chosenField: 'links.permalink' }
  if (links.alias) return { url: links.alias, chosenField: 'links.alias' }
  if (matching.ssl_url) return { url: matching.ssl_url, chosenField: 'ssl_url' }
  if (matching.url) return { url: matching.url, chosenField: 'url' }
  return { url: null, chosenField: null }
}

export { previewDeploysForBranch, findMatchingDeploy, choosePreviewUrl, summarizeCandidates }
