export type AvailableLink<L extends string> = { type: 'available'; href: string; locale: L }
export type MissingLink<L extends string> = { type: 'missing'; href: null; locale: L }
export type DraftLink<L extends string> = { type: 'draft'; href: string; locale: L }

export type TranslationLink<L extends string> = AvailableLink<L> | MissingLink<L> | DraftLink<L>
export type AccessibleTranslationLink<L extends string> = AvailableLink<L> | DraftLink<L>

/** Construye un TranslationLink disponible con href. */
export function availableLink<L extends string>(href: string, lang: L): AvailableLink<L> {
  return { type: 'available', href, locale: lang }
}

/** Construye un TranslationLink no disponible (missing). */
export function missingLink<L extends string>(lang: L): MissingLink<L> {
  return { type: 'missing', href: null, locale: lang }
}

/** Construye un TranslationLink que representa un draft (borrador). */
export function draftLink<L extends string>(href: string, lang: L): DraftLink<L> {
  return { type: 'draft', href, locale: lang }
}

export function isAccessible<L extends string>(link: TranslationLink<L>): link is AccessibleTranslationLink<L> {
  return link.type === 'available' || link.type === 'draft'
}

export function isAvailable<L extends string>(link: TranslationLink<L>): link is AvailableLink<L> {
  return link.type === 'available'
}

export function isDraft<L extends string>(link: TranslationLink<L>): link is DraftLink<L> {
  return link.type === 'draft'
}

export function isMissing<L extends string>(link: TranslationLink<L>): link is MissingLink<L> {
  return link.type === 'missing'
}

/**
 * Selecciona el enlace canónico accesible (`available`|`draft`) a partir de
 * un arreglo de `links`.
 *
 * Preferencia (en orden):
 * 1) `available` para `defaultLang`
 * 2) primer `available` cualquiera
 * 3) `draft` para `defaultLang` si existe
 * 4) primer `draft` cualquiera
 * 5) `undefined` si no hay ningún accesible
 */
export function resolveDefaultAccessibleLink<L extends string>(
  links: TranslationLink<L>[],
  defaultLang: L
): AccessibleTranslationLink<L> | undefined {
  if (!links || links.length === 0) throw new Error('resolveDefaultAccessibleLink: unexpected empty links array')

  const defaultAny = links.find(l => l.locale === defaultLang)
  if (defaultAny && isAvailable(defaultAny)) return defaultAny

  const firstAvailable = links.find(isAvailable)
  if (firstAvailable) return firstAvailable

  if (defaultAny && isDraft(defaultAny)) return defaultAny

  const firstDraft = links.find(isDraft)
  if (firstDraft) return firstDraft

  throw new Error(
    'resolveDefaultAccessibleLink: expected at least one accessible link'
  )
}
