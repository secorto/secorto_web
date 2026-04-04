import { type UILanguages, defaultLang } from '@i18n/ui'

export type AvailableLink = { type: 'available'; href: string; locale: UILanguages }
export type MissingLink = { type: 'missing'; href: null; locale: UILanguages }
export type DraftLink = { type: 'draft'; href: string; locale: UILanguages }

export type TranslationLink = AvailableLink | MissingLink | DraftLink
export type AccessibleTranslationLink = AvailableLink | DraftLink

/** Construye un TranslationLink disponible con href. */
export function availableLink(href: string, lang: UILanguages): AvailableLink {
  return { type: 'available', href, locale: lang }
}

/** Construye un TranslationLink no disponible (missing). */
export function missingLink(lang: UILanguages): MissingLink {
  return { type: 'missing', href: null, locale: lang }
}

/** Construye un TranslationLink que representa un draft (borrador). */
export function draftLink(href: string, lang: UILanguages): DraftLink {
  return { type: 'draft', href, locale: lang }
}

export function isAccessible(link: TranslationLink): link is AvailableLink | DraftLink {
  return link.type === 'available' || link.type === 'draft'
}

export function isAvailable(link: TranslationLink): link is AvailableLink {
  return link.type === 'available'
}

export function isDraft(link: TranslationLink): link is DraftLink {
  return link.type === 'draft'
}

export function isMissing(link: TranslationLink): link is MissingLink {
  return link.type === 'missing'
}

/**
 * Selecciona el `TranslationLink` canónico a partir de un arreglo de `links`.
 *
 * Reglas:
 * 1) Si existe un `available` para `defaultLang`, devolverlo
 * 2) Si no, devolver el primer `available` en el orden recibido
 * 3) Si no hay `available`, devolver el primer `draft` en el orden recibido
 * 4) Si no hay `available` ni `draft`, devolver `undefined` (no se debe
 *    devolver un `missing` como valor canónico porque su `href` es `null`).
 *
 * @returns El `AccessibleTranslationLink` seleccionado o `undefined` si no existe uno
 *          accesible (available/draft). Esto evita que consumidores usen
 *          inadvertidamente un `href` nulo (p.ej. al emitir `x-default`).
 */
export function resolveDefaultLocaleFromLinks(links: TranslationLink[]): AccessibleTranslationLink | undefined {
  if (!links || links.length === 0) throw new Error('resolveDefaultLocaleFromLinks: unexpected empty links array')

  const defaultAvailable = links.find(l => isAvailable(l) && l.locale === defaultLang)
  // Cast necesario: `find` no estrecha el tipo con el type guard `isAvailable`.
  if (defaultAvailable) return defaultAvailable as AvailableLink

  const firstAvailable = links.find(isAvailable)
  if (firstAvailable) return firstAvailable

  const firstDraft = links.find(isDraft)
  if (firstDraft) return firstDraft

  return undefined
}
