/**
 * Devuelve la URL base tal como se interpreta desde las variables de
 * entorno.
 *
 * Precedencia:
 * 1. NETLIFY_PREVIEW_URL
 * 2. BASE_URL
 *
 * Comportamiento:
 * - Se aplica `trim()` a los valores obtenidos de las variables de
 *   entorno.
 * - Las cadenas vacías o que contienen solo whitespace se consideran
 *   "unset" y no se usan como valor efectivo.
 * - Devuelve la versión trimmed (`string`) si existe un valor efectivo,
 *   o `undefined` si no hay ninguna variable con valor válido.
 */
export function getBaseUrlEnv(): string | undefined {
  const netlify = process.env.NETLIFY_PREVIEW_URL
  const base = process.env.BASE_URL

  if (netlify != null) {
    const trimmed = netlify.trim()
    if (trimmed !== '') return trimmed
  }

  if (base != null) {
    const trimmed = base.trim()
    if (trimmed !== '') return trimmed
  }

  return undefined
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

