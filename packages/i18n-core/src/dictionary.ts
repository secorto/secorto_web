/**
 * Represents a localized value for a specific language.
 * @template Language - The language code (e.g., 'es', 'en').
 * @template TValue - The type of the value (e.g., string, number, object).
 */
export type LocalizedValue<
  Language extends string,
  TValue
> = Record<Language, TValue>

/**
 * Represents a dictionary of localized values for a specific section.
 * @template Section - The section of the application (e.g., 'blog', 'docs').
 * @template Language - The language code (e.g., 'es', 'en').
 * @template TValue - The type of the value (e.g., string, number, object).
 */
export type SectionDictionary<
  Section extends string,
  Language extends string,
  TValue
> = Record<
  Section,
  LocalizedValue<Language, TValue>
>

/**
 * Represents a branded type for section routes, ensuring type safety.
 * @template K - The brand key (e.g., 'SectionRoutes').
 * @template T - The underlying type (e.g., SectionDictionary).
 */
export type Brand<K, T> = T & { __brand: K }
