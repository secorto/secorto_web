import { parse } from 'yaml'

export type Frontmatter = Record<string, unknown>

export function parseFrontmatter(text: string): Frontmatter {
  // Normalize newlines to LF so parser works with files checked out on Windows (CRLF)
  const normalized = text.replace(/\r\n|\r/g, '\n')
  const m = normalized.match(/^---\n([\s\S]*?)\n---/)
  if (!m) return {}
  return (parse(m[1]) as Frontmatter)
}

export function getNested<T = unknown>(field: Frontmatter, path: string[]): T | undefined {
  let cur: unknown = field
  for (const p of path) {
    if (!cur || typeof cur !== 'object') return undefined
    cur = (cur as Record<string, unknown>)[p]
  }
  return cur as T | undefined
}

export default { parseFrontmatter, getNested }
