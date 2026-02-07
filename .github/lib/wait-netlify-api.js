// @ts-check
/**
 * @typedef {Object} Deploy
 * @property {string} id
 * @property {string} [context]
 * @property {string} [created_at]
 * @property {string} [state]
 */

/**
 * Thin Netlify API wrapper: fetch and validate deploy objects
 */

/**

 * Fetch raw deploy list from Netlify API
 * @param {string} siteId
 * @param {string} token
 * @returns {Promise<unknown[]>} raw parsed JSON
 * @throws {Error} on non-OK response
 */
async function listDeploysRaw(siteId, token) {
  const res = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/deploys?per_page=20`, {
    headers: { Authorization: 'Bearer ' + token }
  })
  if (!res.ok) throw new Error(`Netlify API status ${res.status}`)
  return res.json()
}

/**
 * Validate the shape of the deploy list returned by Netlify
 * @param {unknown} data
 * @returns {Deploy[]}
 */
function validateDeploys(data) {
  if (!Array.isArray(data)) throw new Error('validateDeploys: expected array from Netlify API')
  for (let i = 0; i < data.length; i++) {
    const d = data[i]
    if (!d || typeof d !== 'object') throw new Error(`validateDeploys: invalid deploy at index ${i} (not an object)`)
    if (!d.context || typeof d.context !== 'string') throw new Error(`validateDeploys: invalid deploy at index ${i} (missing or invalid context)`)
    if (d.created_at && isNaN(Date.parse(String(d.created_at)))) throw new Error(`validateDeploys: invalid deploy at index ${i} (invalid created_at)`)
    if (!d.id) throw new Error(`validateDeploys: invalid deploy at index ${i} (missing id)`)
  }
  return /** @type {Deploy[]} */ (data)
}

/**
 * Get validated deploy list for a site
 * @param {string} siteId
 * @param {string} token
 * @returns {Promise<Deploy[]>}
 */
async function listDeploys(siteId, token) {
  const data = await listDeploysRaw(siteId, token)
  return validateDeploys(data)
}

export { listDeploys, listDeploysRaw, validateDeploys }
