import { parse } from 'yaml'

/** Parsed frontmatter block represented as a plain key-value map. */
export type Frontmatter = Record<string, unknown>

/**
 * Extracts and parses the YAML frontmatter block from a Markdown string.
 *
 * Handles both LF and CRLF line endings so files checked out on Windows are
 * processed correctly.
 *
 * @param text - Raw file content, including the `---` delimiters.
 * @returns A `Frontmatter` object, or an empty object when no block is found.
 */
export function parseFrontmatter(text: string): Frontmatter {
  // Normalize newlines to LF so parser works with files checked out on Windows (CRLF)
  const normalized = text.replace(/\r\n|\r/g, '\n')
  const m = normalized.match(/^---\n([\s\S]*?)\n---/)
  if (!m) return {}
  return parse(m[1])
}

export default { parseFrontmatter }
