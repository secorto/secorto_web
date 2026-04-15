import http from 'http'
import https from 'https'
import { getBaseUrl } from './src/config/baseUrl'

async function globalSetup() {
  const baseUrl = getBaseUrl()

  console.log(`\n🩺 Iniciando Health Check: ${baseUrl}`)

  const check = () => new Promise((resolve, reject) => {
    const protocol = baseUrl.startsWith('https') ? https : http
    const req = protocol.get(baseUrl, (res) => {
      if (res.statusCode && res.statusCode < 400) resolve(true)
      else reject(new Error(`Status: ${res.statusCode}`))
    })
    req.on('error', reject)
    req.setTimeout(5000, () => { req.destroy(); reject(new Error('Timeout')) })
  })

  try {
    await check()
    console.log(`✅ URL alcanzable. Arrancando suites...\n`)
  } catch (error) {
    console.error(
      `❌ FALLO CRÍTICO: La URL ${baseUrl} no responde.\n` +
      `Error: ${(error as Error).message}\n` +
      'Asegúrate de que el despliegue terminó o el servidor local está activo.\n'
    )
    process.exit(1)
  }
}

export default globalSetup
