/**
 * Devuelve la URL base tal cual viene del entorno.
 *
 * Precedencia:
 * 1. NETLIFY_PREVIEW_URL
 * 2. BASE_URL
 *
 * No realiza normalización ni trim; puede devolver la cadena exacta
 * (incluyendo la posibilidad de una cadena vacía) o `undefined` si no
 * existe ninguna variable establecida.
 */
export function getBaseUrlEnv(): string | undefined {
  return (
    process.env.NETLIFY_PREVIEW_URL
    ?? process.env.BASE_URL
  )
}

/**
 * Devuelve la URL base a usar por herramientas y tests.
 *
 * Retorna el valor de `getBaseUrlEnv()` o el fallback
 * `'http://localhost:4321'` cuando el valor de entorno es "falsy".
 */
export function getBaseUrl(): string {
  return getBaseUrlEnv() || 'http://localhost:4321'
}

