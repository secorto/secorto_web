import { Locales } from "./locale"

/**
 * Represents a translation that is available and can be accessed by users.
 */
export type AvailableLink<L extends string> = {
  type: 'available'
  href: string
  locale: L
}

/**
 * Represents a translation that does not exist for the given locale.
 */
export type MissingLink<L extends string> = {
  type: 'missing'
  href: null
  locale: L
}

/**
 * Represents a translation that exists as a draft but is not yet publicly available.
 */
export type DraftLink<L extends string> = {
  type: 'draft'
  href: string
  locale: L
}

/**
 * Represents the state of a translation for a locale.
 */
export type TranslationLink<L extends string> =
  | AvailableLink<L>
  | MissingLink<L>
  | DraftLink<L>

/**
 * Represents a translation link that can be accessed, either as a published
 * translation (`available`) or as a draft (`draft`).
 */
export type AccessibleTranslationLink<L extends string> =
  | AvailableLink<L>
  | DraftLink<L>


/**
 * Creates an available translation link.
 */
export function availableLink<L extends string>(
  href: string,
  lang: L
): AvailableLink<L> {
  return { type: 'available', href, locale: lang }
}

/**
 * Creates a missing translation link.
 */
export function missingLink<L extends string>(
  lang: L
): MissingLink<L> {
  return { type: 'missing', href: null, locale: lang }
}

/**
 * Creates a draft translation link.
 */
export function draftLink<L extends string>(
  href: string,
  lang: L
): DraftLink<L> {
  return { type: 'draft', href, locale: lang }
}

/** Returns whether the link is accessible. */
export function isAccessible<L extends string>(link: TranslationLink<L>): link is AccessibleTranslationLink<L> {
  return link.type === 'available' || link.type === 'draft'
}

/** Returns whether the link is available. */
export function isAvailable<L extends string>(link: TranslationLink<L>): link is AvailableLink<L> {
  return link.type === 'available'
}

/** Returns whether the link is a draft. */
export function isDraft<L extends string>(link: TranslationLink<L>): link is DraftLink<L> {
  return link.type === 'draft'
}

/** Returns whether the link is missing. */
export function isMissing<L extends string>(link: TranslationLink<L>): link is MissingLink<L> {
  return link.type === 'missing'
}

/**
 * Resolves the default accessible translation link from a collection of links.
 *
 * Selection priority:
 * 1. An `available` link matching `defaultLang`.
 * 2. The first `available` link.
 * 3. A `draft` link matching `defaultLang`.
 * 4. The first `draft` link.
 *
 * @template L Type representing the supported locales.
 * @param links Translation links to evaluate.
 * @param defaultLang Preferred locale to prioritize during selection.
 * @returns The selected accessible translation link.
 *
 * @throws {Error} If `links` is empty or if no accessible link exists.
 */
export function resolveDefaultAccessibleLink<L extends string>(
  links: TranslationLink<L>[],
  defaultLang: L
): AccessibleTranslationLink<L> {
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

export function createAvailableLinks<L extends string>(
  locales: Locales<L>,
  getHref: (locale: L) => string
): AvailableLink<L>[] {
  return locales.all.map(locale => ({
    type: 'available',
    href: getHref(locale),
    locale
  }))
}
