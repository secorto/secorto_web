import { availableLink, missingLink, TranslationLink } from "../core";
import { TagRoutes } from "./route";

/**
 * Creates translation links for a section tag page across all supported locales.
 *
 * Locales listed in `siblings` are considered available and will produce
 * an `available` translation link using the localized tag URL.
 *
 * Any locale not present in `siblings` is represented as a `missing`
 * translation link.
 *
 * This helper is intended for localized section tag pages such as:
 *
 * - /en/blog/tags/javascript
 * - /es/blog/tags/javascript
 *
 * @template TTag Supported tag identifiers.
 * @template TSection Supported section identifiers.
 * @template TLocale Supported locale identifiers.
 *
 * @param locales All supported locales.
 * @param siblings Locales where the current section tag page exists.
 * @param section Section containing the tag.
 * @param tag Tag whose translation links should be generated.
 * @param tagRoutes Tag route definitions used to resolve localized URLs.
 *
 * @returns Translation links for every supported locale.
 */
export function createSectionTagTranslationLinks<
  TTag extends string,
  TSection extends string,
  TLocale extends string,
>(
  locales: readonly TLocale[],
  siblings: readonly TLocale[],
  section: TSection,
  tag: TTag,
  tagRoutes: TagRoutes<
    TTag,
    TSection,
    TLocale
  >,
): TranslationLink<TLocale>[] {
  return locales.map(locale =>
    siblings.includes(locale)
      ? availableLink(
        tagRoutes.getSectionTagURL(
          section,
          locale,
          tag,
        ),
        locale,
      )
      : missingLink(locale),
  )
}
