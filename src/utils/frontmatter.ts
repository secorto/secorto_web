/**
 * Simple frontmatter parser tailored for project tests.
 * - Extracts the YAML frontmatter block delimited by `---`
 * - Parses simple scalar keys, quoted strings, arrays (lines starting with `- `)
 * - Parses one-level nested maps using indentation (2 spaces)
 *
 * Not a full YAML parser but sufficient for validating fields like
 * `translation_origin.locale` in tests and content checks.
 */

export type Frontmatter = Record<string, unknown>

function parseValue(raw: string): unknown {
  const v = raw.trim()
  if (v === 'true') return true
  if (v === 'false') return false
  if (/^-?\d+$/.test(v)) return Number(v)
  // quoted
  const m = v.match(/^['"]([\s\S]*)['"]$/)
  if (m) return m[1]
  return v
}

export function parseFrontmatter(text: string): Frontmatter {
  // Normalize newlines to LF so parser works with files checked out on Windows (CRLF)
  const normalized = text.replace(/\r\n|\r/g, '\n')
  const m = normalized.match(/^---\n([\s\S]*?)\n---/)
  if (!m) return {}
  const block = m[1]
  const lines = block.split('\n')

  const result: Frontmatter = {}
  let currentKey: string | null = null
  for (const line of lines) {
    // nested map (2 spaces)
    const nestedMatch = line.match(/^  ([a-zA-Z0-9_\-]+):\s*(.*)$/)
    if (nestedMatch && currentKey) {
      const k = nestedMatch[1]
      const raw = nestedMatch[2]
      if (typeof result[currentKey] !== 'object' || result[currentKey] === null) {
        result[currentKey] = {}
      }
      ;(result[currentKey] as Record<string, unknown>)[k] = raw ? parseValue(raw) : ''
      continue
    }

    // array item
    const arrMatch = line.match(/^[\s]*-\s+(.*)$/)
    if (arrMatch && currentKey) {
      const val = parseValue(arrMatch[1])
      if (!Array.isArray(result[currentKey])) result[currentKey] = []
      ;(result[currentKey] as unknown[]).push(val)
      continue
    }

    // top-level key: value
    const kv = line.match(/^([a-zA-Z0-9_\-]+):\s*(.*)$/)
    if (kv) {
      const key = kv[1]
      const raw = kv[2]
      currentKey = key
      if (raw === '') {
        // value may be nested in following indented lines
        result[key] = {}
      } else if (raw.startsWith('[') && raw.endsWith(']')) {
        // simple inline array: [a, b]
        const items = raw.slice(1, -1).split(',').map(s => parseValue(s))
        result[key] = items
      } else {
        result[key] = parseValue(raw)
      }
    } else {
      currentKey = null
    }
  }

  return result
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
