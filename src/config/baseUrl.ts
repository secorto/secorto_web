/**
 * Devuelve la URL base canónica para pruebas E2E y configuraciones.
 *
 * Precedencia de variables de entorno:
 * 1. `NETLIFY_PREVIEW_URL`
 * 2. `BASE_URL`
 * 3. valor por defecto `http://localhost:4321`
 *
 * @returns {string} URL base para usar en Playwright y globalSetup
 * @example
 * const baseUrl = getBaseUrl()
 */
export function getBaseUrl(): string {
  return (
    process.env.NETLIFY_PREVIEW_URL
    ?? process.env.BASE_URL
    ?? 'http://localhost:4321'
  )
}

export default getBaseUrl
