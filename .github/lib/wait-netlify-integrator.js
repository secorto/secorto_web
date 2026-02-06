import { extractShaFromDeploy } from './wait-netlify-git.js'

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

function findMatchingDeploy(candidates, expectedSha) {
  if (!Array.isArray(candidates) || candidates.length === 0) return null
  const expected = expectedSha ? String(expectedSha).trim().toLowerCase() : null
  for (const d of candidates) {
    if (d.state !== 'ready') continue
    const { sha: deploySha } = extractShaFromDeploy(d)
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

function choosePreviewUrl(matching) {
  if (!matching) return { url: null, chosenField: null }
  const url = (matching.links && (matching.links.permalink || matching.links.alias)) || matching.ssl_url || matching.url || null
  const chosenField = (matching.links && (matching.links.permalink ? 'links.permalink' : matching.links.alias ? 'links.alias' : null)) || (matching.ssl_url ? 'ssl_url' : url ? 'url' : null)
  return { url, chosenField }
}

export { previewDeploysForBranch, findMatchingDeploy, choosePreviewUrl, summarizeCandidates }
