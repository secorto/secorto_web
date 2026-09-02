import type { Locales } from '../core'
import type { SectionRoutes } from '../section/routes'

export interface SectionPath<
  TSection extends string,
  TLocale extends string
> {
  params: {
    locale: TLocale
    section: string
  }
  props: {
    section: TSection
  }
}

/**
 * Generates the static path definitions required to build localized top-level 
 * landing or list pages for all configured sections.
 *
 * For each section defined in `routes`, this function:
 * 1. Iterates through all allowed locales.
 * 2. Resolves the localized route string for the section.
 * 3. Produces a path containing the routing parameters and the raw section identifier.
 *
 * The resulting paths can be consumed by static site generators (like Astro) to create
 * localized section index pages with access to the current section domain key.
 *
 * @template TSection Section identifiers (for example: `'blog' | 'docs'`).
 * @template TLocale Locale identifiers (for example: `'en' | 'es'`).
 *
 * @param routes Localized section routes used to resolve URL segments.
 * @param allowedLocales Supported locales configurations.
 * @returns A promise that resolves to an array of section path definitions.
 */
export async function getStaticPathsSections<
  TSection extends string,
  TLocale extends string,
>(
  routes: SectionRoutes<TSection, TLocale>,
  allowedLocales: Locales<TLocale>,
): Promise<SectionPath<TSection, TLocale>[]> {

  const allPaths: SectionPath<TSection, TLocale>[] = []

  for (const sectionKey of routes.getSections()) {
    for (const locale of allowedLocales.all) {
      allPaths.push({
        params: {
          locale,
          section: routes.getSectionRoute(sectionKey, locale),
        },
        props: {
          section: sectionKey,
        },
      })
    }
  }
  return allPaths
}
