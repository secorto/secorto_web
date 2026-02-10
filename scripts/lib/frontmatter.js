// @ts-check
import { load } from 'js-yaml'

/**
 * Extrae y parsea frontmatter YAML desde el contenido de un fichero.
 * @param {string} content
 * @returns {Record<string, any>}
 * @throws {Error} si el YAML es inválido
 */
export function parseFrontmatterFromContent(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
  if (!match) return {}
  const yaml = match[1]
  const data = load(yaml)
  return data || {}
}

export default { parseFrontmatterFromContent }
