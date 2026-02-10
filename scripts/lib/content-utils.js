// @ts-check
import fs from 'fs'
import path from 'path'
import { parseFrontmatterFromContent } from './frontmatter.js'
import { printError } from './log-util.js'

/**
 * Recursively list .md files under a directory using simple fs APIs.
 * @param {string} dir
 * @returns {string[]}
 */
export function listMdFiles(dir) {
  if (!fs.existsSync(dir)) return []
  const names = fs.readdirSync(dir, { withFileTypes: true })
  /** @type {string[]} */
  let files = []
  for (const ent of names) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) files = files.concat(listMdFiles(p))
    else if (ent.isFile() && p.endsWith('.md')) files.push(p)
  }
  return files
}

/**
 * Build a nested map: collection -> id -> locale -> { path, fm }
 * Returns a Map where values are Maps to preserve the current callers' expectations.
 * @param {string} contentDir
 * @returns {Map<string, Map<string, Map<string, {path:string, fm:Record<string, any>}>>>}
 */
export function buildContentMap(contentDir) {
  if (!fs.existsSync(contentDir)) return new Map()
  /** @type {string[]} */
  const files = listMdFiles(contentDir)

  /**
   * Map of collection -> id -> locale -> {path, fm}
   * @type {Map<string, Map<string, Map<string, {path:string, fm:Record<string, any>}>>>}
   */
  const collectionMap = new Map()

  /**
   * Get a value from a Map or create-and-set it using the provided factory.
   * @template K, V
   * @param {Map<K, V>} mapObj
   * @param {K} key
   * @param {() => V} create
   * @returns {V}
   */
  const getOrCreate = (mapObj, key, create) => {
    const existing = mapObj.get(key)
    if (existing) return existing
    const next = create()
    mapObj.set(key, next)
    return next
  }

  /**
   * Parse a markdown file and return a small descriptor.
   * Uses a lightweight frontmatter extractor and `js-yaml` to parse YAML.
   * @param {string} filePath
   * @returns {{path:string, fm: Record<string, any>}}
   */
  const parseFile = (filePath) => {
    const content = fs.readFileSync(filePath, 'utf8')
    try {
      const data = parseFrontmatterFromContent(content)
      return { path: filePath, fm: data }
    } catch (e) {
      // use shared printError util from .github scripts to keep logging consistent
      printError(`Warning: failed to parse frontmatter for ${filePath}:`, e)
      return { path: filePath, fm: {} }
    }
  }

  for (const filePath of files) {
    const rel = path.relative(contentDir, filePath)
    const parts = rel.split(path.sep)
    // expected layout: <collection>/<locale>/<id...>.md
    if (parts.length < 3) continue
    const [collection, locale, ...rest] = parts
    const id = rest.join(path.sep)

    const idMap = getOrCreate(collectionMap, collection, () => new Map())
    const localeMap = getOrCreate(idMap, id, () => new Map())

    const fileInfo = parseFile(filePath)
    localeMap.set(locale, fileInfo)
  }

  return collectionMap
}
