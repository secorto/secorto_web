/**
 * Ensures that no duplicate (locale, slug) combinations exist across different contexts.
 *
 * @template TContext - The union type representing available route contexts.
 * @template TLocale - The union type representing supported locales.
 *
 * @param routesMap - A map of contexts containing locale-to-slug route definitions.
 * @param contextName - A descriptive name used in error messages to identify the route group being validated.
 *
 * @throws {Error} If the same locale and slug combination is found in more than one context.
 */
export function ensureNoRouteCollisions<
  TContext extends string,
  TLocale extends string
>(
  routesMap: Record<TContext, Record<TLocale, string>>,
  contextName: string
): void {
  const seen = new Map<string, TContext>()

  for (const context of Object.keys(routesMap) as TContext[]) {
    const localized = routesMap[context]

    for (const locale of Object.keys(localized) as TLocale[]) {
      const slug = localized[locale]
      const key = `${locale}:${slug}`

      if (seen.has(key)) {
        const other = seen.get(key)!
        throw new Error(
          `Route collision detected in ${contextName}: The slug "${slug}" for locale "${locale}" is duplicated between "${other}" and "${context}".`
        )
      }

      seen.set(key, context)
    }
  }
}
