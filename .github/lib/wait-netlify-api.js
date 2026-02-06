// Netlify API thin wrapper

async function listDeploys(siteId, token) {
  if (typeof fetch !== 'function') throw new Error('Global fetch is not available')
  const res = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/deploys?per_page=20`, {
    headers: { Authorization: 'Bearer ' + token }
  })
  if (!res.ok) throw new Error(`Netlify API status ${res.status}`)
  return res.json()
}

export { listDeploys }
