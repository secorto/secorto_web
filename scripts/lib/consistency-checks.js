// @ts-check
/**
 * @typedef {{locale: string, id: string}} LocaleOrigin
 * @typedef {{status?: string, origin?: LocaleOrigin}} LocaleInfo
 * @typedef {Record<string, LocaleInfo>} InfoMap
 * @typedef {{path: string, fm: Record<string, unknown>}} LocaleFile
 */
/**
 * @typedef {{collection: string, id: string, type: string, locale: string, origin?: LocaleOrigin}} Inconsistency
 */

/**
 * Given the content map (collection -> id -> locale -> {path,fm}),
 * return an array of inconsistency objects.
 * @param {Map<string, Map<string, Map<string, LocaleFile>>>} map
 */

/**
 * Build a lightweight `info` object from a locales Map.
 * @param {Map<string, LocaleFile>} locales
 * @returns {InfoMap}
 */
export function buildInfoFromLocales(locales) {
  /** @type {InfoMap} */
  const info = {}
  for (const [locale, data] of locales.entries()) {
    const fm = data && data.fm ? data.fm : {}
    info[locale] = { status: /** @type {string|undefined} */ (fm.translation_status), origin: /** @type {LocaleOrigin|undefined} */ (fm.translation_origin) }
  }
  return info
}

/**
 * Check for `translated_missing_origin` inconsistencies.
 * @param {InfoMap} info
 * @param {string} collection
 * @param {string} id
 */
export function checkTranslatedMissingOrigin(info, collection, id) {
  const out = []
  for (const [locale, data] of Object.entries(info)) {
    if (data.status === 'translated' && (!data.origin || !data.origin.locale || !data.origin.id)) {
      out.push({ collection, id, type: 'translated_missing_origin', locale })
    }
  }
  return out
}

/**
 * Check for `origin_but_not_translated` inconsistencies.
 * @param {InfoMap} info
 * @param {string} collection
 * @param {string} id
 * @returns {Inconsistency[]}
 */
export function checkOriginButNotTranslated(info, collection, id) {
  const out = []
  for (const [locale, data] of Object.entries(info)) {
    if (data.origin && data.origin.locale) {
      if (data.status !== 'translated') {
        out.push({ collection, id, type: 'origin_but_not_translated', locale, origin: data.origin })
      }
    }
  }
  return out
}

/**
 * Check for `origin_present_both_original` inconsistencies.
 * @param {InfoMap} info
 * @param {string} collection
 * @param {string} id
 * @returns {Inconsistency[]}
 */
export function checkOriginPresentBothOriginal(info, collection, id) {
  const out = []
  for (const [locale, data] of Object.entries(info)) {
    if (data.origin && data.origin.locale) {
      const target = data.origin.locale
      const targetData = info[target]
      if (targetData && targetData.status === 'original' && data.status === 'original') {
        out.push({ collection, id, type: 'origin_present_both_original', locale, origin: data.origin })
      }
    }
  }
  return out
}

/**
 * Given the content map (collection -> id -> locale -> {path,fm}),
 * return an array of inconsistency objects.
 * @param {Map<string, Map<string, Map<string, LocaleFile>>>} map
 * @returns {Inconsistency[]}
 */
export function findInconsistenciesFromMap(map) {
  const inconsistencies = []
  for (const [collection, collMap] of map.entries()) {
    for (const [id, locales] of collMap.entries()) {
      const localesList = Array.from(locales.keys())
      if (localesList.length < 2) continue
      const info = buildInfoFromLocales(locales)
      inconsistencies.push(...checkTranslatedMissingOrigin(info, collection, id))
      inconsistencies.push(...checkOriginButNotTranslated(info, collection, id))
      inconsistencies.push(...checkOriginPresentBothOriginal(info, collection, id))
    }
  }
  return inconsistencies
}
