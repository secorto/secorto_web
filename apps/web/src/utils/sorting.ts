/**
 * Ordena por prioridad y luego por identificador, sin mutar el array original.
 * Es el fallback común para listados heterogéneos.
 */
export function sortByPriority<T extends { cleanId: string; data: { priority?: number; date?: Date; startDate?: Date } }>(
  items: T[]
): T[] {
  return items.slice().sort((a, b) => compareByPriorityAndDate(a, b, item => item.data.date ?? item.data.startDate))
}

function compareByPriorityAndDate<T extends { cleanId: string; data: { priority?: number } }>(
  a: T,
  b: T,
  getDate: (item: T) => Date | undefined,
): number {
  const pa = getPriority(a)
  const pb = getPriority(b)
  if (pa !== pb) return pb - pa

  const ta = getComparableTimestamp(getDate(a))
  const tb = getComparableTimestamp(getDate(b))
  if (ta !== tb) return tb - ta

  return a.cleanId.localeCompare(b.cleanId)
}

function getPriority<T extends { data: { priority?: number } }>(item: T): number {
  return Number.isInteger(item.data.priority) ? (item.data.priority as number) : 0
}

function getComparableTimestamp(date: Date | undefined): number {
  if (!date) return Number.NEGATIVE_INFINITY
  const ts = date.getTime()
  return Number.isFinite(ts) ? ts : Number.NEGATIVE_INFINITY
}

/**
 * Ordena entradas de tipo blog/publicación por prioridad y fecha de publicación.
 */
export function sortPostsByPriority<T extends { cleanId: string; data: { priority?: number; date?: Date } }>(
  items: T[]
): T[] {
  return items.slice().sort((a, b) => compareByPriorityAndDate(a, b, item => item.data.date))
}

/**
 * Ordena entradas de tipo experiencia por prioridad y fecha de inicio.
 */
export function sortExperienceByPriority<T extends { cleanId: string; data: { priority?: number; startDate?: Date } }>(
  items: T[]
): T[] {
  return items.slice().sort((a, b) => compareByPriorityAndDate(a, b, item => item.data.startDate))
}
