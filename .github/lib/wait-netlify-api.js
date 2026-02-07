// Netlify API thin wrapper

async function listDeploys(siteId, token) {
  const res = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/deploys?per_page=20`, {
    headers: { Authorization: 'Bearer ' + token }
  })
  if (!res.ok) throw new Error(`Netlify API status ${res.status}`)
  const data = await res.json()
  if (!Array.isArray(data)) throw new Error('listDeploys: expected array from Netlify API')
  return data
}

export { listDeploys }
