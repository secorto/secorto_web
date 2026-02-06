// Git-related helpers for extracting SHAs from Netlify deploy objects

function extractShaFromDeploy(deploy) {
  if (!deploy) return { sha: null, field: null }
  const fields = [
    ['commit_ref', deploy.commit_ref],
    ['commit_url', deploy.commit_url],
    ['commit_message', deploy.commit_message],
    ['sha', deploy.sha],
    ['commit_sha', deploy.commit_sha],
    ['title', deploy.title]
  ]
  for (const [field, value] of fields) {
    if (!value) continue
    const m = String(value).match(/[0-9a-f]{7,40}/i)
    if (m) return { sha: String(m[0]).trim().toLowerCase(), field }
  }
  return { sha: null, field: null }
}

export { extractShaFromDeploy }
