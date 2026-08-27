import { describe, expect, it } from 'vitest'

import { createLocales, GenericCollectionEntry, createSectionRoutes, LocalizedEntry, createDetailTranslationLinks } from '@secorto/i18n'

type Locale = "en" | "es" | "fr"
type Section = "blog"

type BlogEntry = GenericCollectionEntry<
  Section,
  {
    title: string
  }
>

function localizedEntry(
  locale: Locale,
  cleanId: string,
): LocalizedEntry<BlogEntry, Locale> {
  return {
    cleanId,
    locale,
    translationKey: cleanId,
    original: {
      id: `${locale}/${cleanId}`,
      collection: "blog",
      data: {
        title: "Test",
      },
    },
  }
}

describe("createDetailTranslationLinks", () => {
  const locales = createLocales(["en", "es", "fr"] as const)

  const sectionRoutes = createSectionRoutes({
    blog: {
      en: "blog",
      es: "blog",
      fr: "blog",
    },
  })

  it("returns available links for existing translations", () => {
    const result = createDetailTranslationLinks(
      {
        en: localizedEntry("en", "article"),
        es: localizedEntry("es", "articulo"),
      },
      sectionRoutes,
      locales,
    )

    expect(result).toEqual([
      {
        type: "available",
        href: "/en/blog/article",
        locale: "en",
      },
      {
        type: "available",
        href: "/es/blog/articulo",
        locale: "es",
      },
      {
        type: "missing",
        href: null,
        locale: "fr",
      },
    ])
  })

  it("returns missing links when translations do not exist", () => {
    const result = createDetailTranslationLinks(
      {},
      sectionRoutes,
      locales,
    )

    expect(result).toEqual([
      {
        type: "missing",
        href: null,
        locale: "en",
      },
      {
        type: "missing",
        href: null,
        locale: "es",
      },
      {
        type: "missing",
        href: null,
        locale: "fr",
      },
    ])
  })

  it("preserves locale order", () => {
    const result = createDetailTranslationLinks(
      {
        es: localizedEntry("es", "articulo"),
      },
      sectionRoutes,
      locales,
    )

    expect(result.map(link => link.locale)).toEqual([
      "en",
      "es",
      "fr",
    ])
  })
})