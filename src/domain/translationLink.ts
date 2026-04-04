import type { UILanguages } from '@i18n/ui'

export type TranslationLink =
  | { type: 'available'; href: string; locale: UILanguages }
  | { type: 'missing'; href: null; locale: UILanguages }
  | { type: 'draft'; href: string; locale: UILanguages }

/** Construye un TranslationLink disponible con href. */
export function availableLink(href: string, lang: UILanguages): TranslationLink {
  return { type: 'available', href, locale: lang }
}

/** Construye un TranslationLink no disponible (missing). */
export function missingLink(lang: UILanguages): TranslationLink {
  return { type: 'missing', href: null, locale: lang }
}

/** Construye un TranslationLink que representa un draft (borrador). */
export function draftLink(href: string, lang: UILanguages): TranslationLink {
  return { type: 'draft', href, locale: lang }
}

export function isAccessible(link: TranslationLink): link is { type: 'available' | 'draft'; href: string; locale: UILanguages } {
  return link.type === 'available' || link.type === 'draft'
}

export function isAvailable(link: TranslationLink): link is { type: 'available'; href: string; locale: UILanguages } {
  return link.type === 'available'
}

export function isDraft(link: TranslationLink): link is { type: 'draft'; href: string; locale: UILanguages } {
  return link.type === 'draft'
}

export function isMissing(link: TranslationLink): link is { type: 'missing'; href: null; locale: UILanguages } {
  return link.type === 'missing'
}
