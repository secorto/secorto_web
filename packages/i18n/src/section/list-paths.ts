import type { Locales } from "../core"
import type { SectionRoutes } from "./routes"

export interface SectionPath<
  TLocale extends string,
  TSection extends string
> {
  params: {
    locale: TLocale
    section: string
  }
  props: {
    section: TSection
  }
}

export async function getStaticPathSection<
  C extends string,
  L extends string,
>(
  routes: SectionRoutes<C, L>,
  allowedLocales: Locales<L>,
): Promise<SectionPath<L, C>[]> {

  const allPaths: SectionPath<L, C>[] = []

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
