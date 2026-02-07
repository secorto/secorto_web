// @ts-check
/**
 * @typedef {Object} Deploy
 * @property {string} [commit_ref]
 * @property {string} [commit_url]
 * @property {string} [commit_message]
 * @property {string} [sha]
 * @property {string} [commit_sha]
 * @property {string} [title]
 */

/**
 * @typedef {{sha: string|null, field: string|null|undefined}} ExtractResult
 */

// Git-related helpers for extracting SHAs from Netlify deploy objects

/**
 * Extract a SHA-like token from common deploy fields
 * @param {Deploy} deploy
 * @returns {ExtractResult}
 */
function extractShaFromDeploy(deploy) {
  const candidateFields = [
    ['commit_ref', deploy.commit_ref],
    ['commit_url', deploy.commit_url],
    ['commit_message', deploy.commit_message],
    ['sha', deploy.sha],
    ['commit_sha', deploy.commit_sha],
    ['title', deploy.title]
  ]

  const found = candidateFields.find(([name, value]) => {
    if (!value) return false
    return /[0-9a-f]{7,40}/i.test(String(value))
  })

  if (!found) return { sha: null, field: null }

  const [fieldName, fieldValue] = found
  const match = String(fieldValue).match(/[0-9a-f]{7,40}/i)
  if (!match) return { sha: null, field: fieldValue }
  const sha = String(match[0]).trim().toLowerCase()
  return { sha, field: fieldName }
}

export { extractShaFromDeploy }
