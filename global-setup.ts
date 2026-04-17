import { getBaseUrl } from './src/config/baseUrl'

async function globalSetup() {
  const baseUrl = getBaseUrl()

  console.log(`🩺 Iniciando Health Check: ${baseUrl}`)
  try {
    const res = await fetch(baseUrl, { method: 'GET', signal: AbortSignal.timeout(5000) })
    // Consumir el body asegura que no queden streams abiertos
    await res.arrayBuffer()
    if (!res.ok) throw new Error(`Status: ${res.status}`)
    console.log(`✅ URL alcanzable. Arrancando suites...\n`)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(
      `❌ FALLO CRÍTICO: La URL ${baseUrl} no responde.\n` +
      `Error: ${message}\n` +
      'Asegúrate de que el despliegue terminó o el servidor local está activo.'
    )
    throw new Error(`Health-check failed for ${baseUrl}: ${message}`)
  }
}

export default globalSetup
