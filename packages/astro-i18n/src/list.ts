import { getSectionRoute, type SectionRoutes } from '@secorto/i18n-core'

type ListingPath<C extends string, L extends string> = {
  params: {
    locale: L
    section: string
  },
  props: {
    section: C
  }
}

export async function getStaticPathsSections<
  C extends string,
  L extends string,
>(
  routes: SectionRoutes<C, L>,
  allowedLocales: readonly L[]
): Promise<ListingPath<C, L>[]> {
  const paths: ListingPath<C, L>[] = []

  for (const sectionKey of Object.keys(routes) as C[]) {
    if (sectionKey === '__brand') continue

    for (const locale of allowedLocales) {
      paths.push({
        params: {
          locale,
          section: getSectionRoute(routes, sectionKey, locale)
        },
        props: {
          section: sectionKey
        }
      })
    }
  }

  return paths
}
