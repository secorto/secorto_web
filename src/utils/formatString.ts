export type FormatParam = string | number | boolean

/**
 * Reemplaza placeholders numéricos en la `template` por parámetros proporcionados.
 *
 * Los placeholders tienen la forma `{0}`, `{1}`, ... y se sustituyen por el
 * valor correspondiente en `params` usando `String()`.
 *
 * @param template - Cadena con placeholders, por ejemplo 'Hello {0}'
 * @param params - Array de parámetros (string | number | boolean)
 * @returns Cadena con los placeholders reemplazados
 * @throws {TypeError} si falta algún parámetro necesario para un placeholder
 *
 * Ejemplos:
 * ```ts
 * formatString('Featured {0}', ['title']) // 'Featured title'
 * formatString('{0} + {0}', [1]) // '1 + 1'
 * ```
 */
export function formatString(template: string, params: Array<FormatParam>): string {
  return template.replace(/\{(\d+)\}/g, (_match, index) => {
    const i = parseInt(index, 10)
    if (typeof params[i] === 'undefined') {
      throw new TypeError(`formatString: missing parameter ${i}`)
    }
    return String(params[i])
  })
}
