import { parse } from 'yaml'


/**
 * Extracts and parses the YAML frontmatter block from a Markdown string.
 *
 * Handles both LF and CRLF line endings so files checked out on Windows are
 * processed correctly.
 *
 * @param text - Raw file content, including the `---` delimiters.
 * @returns The raw result from the YAML parser. Callers must narrow this
 * `unknown` value to the shape they expect before accessing properties.
 */
export function parseFrontmatter(text: string): unknown {
  // Normalize newlines to LF so parser works with files checked out on Windows (CRLF)
  const normalized = text.replace(/\r\n|\r/g, '\n')
  const m = normalized.match(/^---\n([\s\S]*?)\n---/)
  if (!m) return {}
  return parse(m[1])
}

export default { parseFrontmatter }
