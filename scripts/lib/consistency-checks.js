// @ts-check
/**
 * Given the content map (collection -> id -> locale -> {path,fm}),
 * return an array of inconsistency objects.
 * @param {Map<string, Map<string, Map<string, {path:string, fm:Record<string, any>}>>>} map
 */
export function findInconsistenciesFromMap(map) {
  const inconsistencies = []

  for (const [collection, collMap] of map.entries()) {
    for (const [id, locales] of collMap.entries()) {
      const localesList = Array.from(locales.keys())
      if (localesList.length < 2) continue
      // collect statuses and origins
      const info = {}
      for (const [locale, data] of locales.entries()) {
        info[locale] = { status: data.fm && data.fm.translation_status, origin: data.fm && data.fm.translation_origin }
      }

      // 1) translation exists but not marked translated or missing translation_origin
      for (const [locale, data] of Object.entries(info)) {
        if (data.status === 'translated' && (!data.origin || !data.origin.locale || !data.origin.id)) {
          inconsistencies.push({ collection, id, type: 'translated_missing_origin', locale })
        }
      }

      // 2) a translation file exists and declares origin but not marked 'translated'
      for (const [locale, data] of Object.entries(info)) {
        if (data.origin && data.origin.locale) {
          // this file claims to be a translation; ensure status === 'translated'
          if (data.status !== 'translated') {
            inconsistencies.push({ collection, id, type: 'origin_but_not_translated', locale, origin: data.origin })
          }
        }
      }

      // 3) both files marked 'original' but one has translation_origin pointing to the other -> inconsistency
      for (const [locale, data] of Object.entries(info)) {
        if (data.origin && data.origin.locale) {
          const target = data.origin.locale
          const targetData = info[target]
          if (targetData && targetData.status === 'original' && data.status === 'original') {
            // translation_origin exists but both marked original
            inconsistencies.push({ collection, id, type: 'origin_present_both_original', locale, origin: data.origin })
          }
        }
      }
    }
  }

  return inconsistencies
}
