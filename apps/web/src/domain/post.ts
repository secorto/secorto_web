import type { CollectionKey, CollectionEntry } from 'astro:content'
import type { ComputedFields } from './entryComputed'

export type PostEntry<C extends CollectionKey> = CollectionEntry<C> & ComputedFields

/**
 * Contrato mínimo del componente ListPost.
 * Tipo estructural — no re-declara el schema de Astro,
 * solo describe exactamente los campos que ListPost accede.
 * `CollectionEntry<'blog'> & { cleanId: string }` satisface este tipo estructuralmente.
 */
export interface PostLikeEntry {
  cleanId: string
  data: {
    title: string
    image?: ImageMetadata
    excerpt?: string
    date?: Date
  }
}

/**
 * Contrato mínimo para entradas de tipo "experience" (work/projects/community).
 * Tipo estructural — no re-declara el schema de Astro,
 * solo describe exactamente los campos que ListWork y WorkDateRange acceden.
 * Las tres colecciones satisfacen este tipo: work tiene startDate requerido,
 * projects y community no lo tienen, pero el tipo los acepta como opcionales.
 */
export interface ExperienceLikeEntry {
  cleanId: string
  data: {
    title: string
    image?: ImageMetadata
    role?: string
    responsibilities?: string
    startDate?: Date
    endDate?: Date
    website?: string
  }
}

/**
 * Genera el texto de rango de fechas para una entrada de tipo "experience".
 * Devuelve null si no hay fecha de inicio.
 *
 * @param startDate - Fecha de inicio (opcional)
 * @param endDate - Fecha de fin (opcional; si falta, se usa `todayLabel`)
 * @param format - Función que convierte una fecha (Date) en string según el locale
 * @param todayLabel - Texto traducido para "hoy" (cuando no hay endDate)
 */
export function formatDateRange(
  startDate: Date | undefined,
  endDate: Date | undefined,
  format: (date: Date) => string,
  todayLabel: string
): string | null {
  if (!startDate) return null
  const start = format(startDate)
  const end = endDate ? format(endDate) : todayLabel
  return `${start} - ${end}`
}

/**
 * Devuelve la descripción SEO a partir de `data`.
 *
 * @param data - objeto con campos opcionales `excerpt` y `description`
 * - Si `excerpt` es una cadena no vacía, se devuelve `excerpt`.
 * - En caso contrario, si `description` es una cadena no vacía, se devuelve `description`.
 * - Si ninguno existe, devuelve cadena vacía.
 */
export function getSeoDescription(
  data: { excerpt?: string; description?: string }
): string {
  const excerpt = typeof data.excerpt === 'string' ? data.excerpt : undefined
  const description = typeof data.description === 'string' ? data.description : undefined
  if (excerpt && excerpt.length > 0) return excerpt
  if (description && description.length > 0) return description
  return ''
}
