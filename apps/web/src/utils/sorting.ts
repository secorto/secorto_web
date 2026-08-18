/**
 * Ordena elementos que cumplan la forma mínima requerida: `{ cleanId: string, data: { priority?: number, date?: Date, startDate?: Date } }`.
 * Devuelve un nuevo array del mismo tipo; no muta el array de entrada (la función mantiene inmutabilidad del caller).
 */
export function sortByPriority<T extends { cleanId: string; data: { priority?: number; date?: Date; startDate?: Date } }>(
  items: T[]
): T[] {
  const getPriority = (e: T) => Number.isInteger(e.data.priority) ? (e.data.priority as number) : 0
  // Use `date` when present (blog/talk), otherwise fallback to `startDate` (work/projects/community)
  const getStartTime = (e: T) => {
    const maybeDate = e.data.date ?? e.data.startDate
    if (!maybeDate) return null
    const ts = maybeDate.getTime()
    // getTime() can return NaN for invalid Date instances; treat non-finite timestamps as missing
    return Number.isFinite(ts) ? ts : null
  }

  return items.slice().sort((a, b) => {
    const pa = getPriority(a)
    const pb = getPriority(b)
    if (pa !== pb) return pb - pa

    // Compare date/startDate as timestamps; missing date => -Infinity (so dated items come first)
    const ta = getStartTime(a) ?? Number.NEGATIVE_INFINITY
    const tb = getStartTime(b) ?? Number.NEGATIVE_INFINITY
    if (ta !== tb) return tb - ta

    return a.cleanId.localeCompare(b.cleanId)
  })
}
