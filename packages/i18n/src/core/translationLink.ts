import type { Locales } from './locale'

/**
 * Represents a translation that is available and can be accessed by users.
 */
export type AvailableLink<TLocale extends string> = {
  type: 'available'
  href: string
  locale: TLocale
}

/**
 * Represents a translation that does not exist for the given locale.
 */
export type MissingLink<TLocale extends string> = {
  type: 'missing'
  href: null
  locale: TLocale
}

/**
 * Represents a translation that exists as a draft but is not yet publicly available.
 */
export type DraftLink<TLocale extends string> = {
  type: 'draft'
  href: string
  locale: TLocale
}

/**
 * Represents the state of a translation for a locale.
 */
export type TranslationLink<TLocale extends string> =
  | AvailableLink<TLocale>
  | MissingLink<TLocale>
  | DraftLink<TLocale>

/**
 * Represents a translation link that can be accessed, either as a published
 * translation (`available`) or as a draft (`draft`).
 */
export type AccessibleTranslationLink<TLocale extends string> =
  | AvailableLink<TLocale>
  | DraftLink<TLocale>


/**
 * Creates an available translation link.
 */
export function availableLink<TLocale extends string>(
  href: string,
  lang: TLocale
): AvailableLink<TLocale> {
  return { type: 'available', href, locale: lang }
}

/**
 * Creates a missing translation link.
 */
export function missingLink<TLocale extends string>(
  lang: TLocale
): MissingLink<TLocale> {
  return { type: 'missing', href: null, locale: lang }
}

/**
 * Creates a draft translation link.
 */
export function draftLink<TLocale extends string>(
  href: string,
  lang: TLocale
): DraftLink<TLocale> {
  return { type: 'draft', href, locale: lang }
}

/** Returns whether the link is accessible. */
export function isAccessible<TLocale extends string>(link: TranslationLink<TLocale>): link is AccessibleTranslationLink<TLocale> {
  return link.type === 'available' || link.type === 'draft'
}

/** Returns whether the link is available. */
export function isAvailable<TLocale extends string>(link: TranslationLink<TLocale>): link is AvailableLink<TLocale> {
  return link.type === 'available'
}

/** Returns whether the link is a draft. */
export function isDraft<TLocale extends string>(link: TranslationLink<TLocale>): link is DraftLink<TLocale> {
  return link.type === 'draft'
}

/** Returns whether the link is missing. */
export function isMissing<TLocale extends string>(link: TranslationLink<TLocale>): link is MissingLink<TLocale> {
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
export function resolveDefaultAccessibleLink<TLocale extends string>(
  links: TranslationLink<TLocale>[],
  defaultLang: TLocale
): AccessibleTranslationLink<TLocale> {
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

export function createAvailableLinks<TLocale extends string>(
  locales: Locales<TLocale>,
  getHref: (locale: TLocale) => string
): AvailableLink<TLocale>[] {
  return locales.all.map(locale => ({
    type: 'available',
    href: getHref(locale),
    locale
  }))
}
