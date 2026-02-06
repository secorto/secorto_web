// Git-related helpers for extracting SHAs from Netlify deploy objects

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
  const sha = String(match[0]).trim().toLowerCase()
  return { sha, field: fieldName }
}

export { extractShaFromDeploy }
