import { describe, expect, it, vi, beforeEach } from 'vitest'

import {
  createLocales,
  createSectionRoutes,
  getStaticPathsEntries,
  type GenericCollectionEntry,
} from "@secorto/i18n"

type Collection = "blog" | "talk"

type Entry = GenericCollectionEntry<
  Collection,
  { title: string }
>

describe("getStaticPathsEntries", () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const routes = createSectionRoutes({
    blog: {
      es: "blog/es",
      en: "blog/en",
    },
    talk: {
      es: "charla/es",
      en: "talk/en",
    },
  })

  const locales = createLocales(["es", "en"] as const)

  const blogEntries: Entry[] = [
    {
      collection: "blog",
      id: "es/post-1",
      data: { title: "Post ES" },
    },
    {
      collection: "blog",
      id: "en/post-1",
      data: { title: "Post EN" },
    },
  ]

  const talkEntries: Entry[] = [
    {
      collection: "talk",
      id: "es/talk-1",
      data: { title: "Charla ES" },
    },
    {
      collection: "talk",
      id: "en/talk-1",
      data: { title: "Talk EN" },
    },
  ]

  const fetchCollection = vi.fn(
    async (collection: Collection): Promise<Entry[]> => {
      switch (collection) {
        case "blog":
          return blogEntries
        case "talk":
          return talkEntries
      }
    },
  )

  it("generates one path per localized entry", async () => {
    const result = await getStaticPathsEntries(
      routes,
      fetchCollection,
      locales,
    )

    expect(result).toHaveLength(4)
  })

  it("generates correct params", async () => {
    const result = await getStaticPathsEntries(
      routes,
      fetchCollection,
      locales,
    )

    expect(
      result.map(path => path.params),
    ).toEqual([
      {
        locale: "es",
        section: "blog/es",
        id: "post-1",
      },
      {
        locale: "en",
        section: "blog/en",
        id: "post-1",
      },
      {
        locale: "es",
        section: "charla/es",
        id: "talk-1",
      },
      {
        locale: "en",
        section: "talk/en",
        id: "talk-1",
      },
    ])
  })

  it("includes sibling translations for blog entries", async () => {
    const result = await getStaticPathsEntries(
      routes,
      fetchCollection,
      locales,
    )

    const blogPath = result.find(
      path =>
        path.props.section === "blog" &&
        path.params.locale === "es",
    )

    expect(blogPath?.props.siblings.es?.original.data.title)
      .toBe("Post ES")

    expect(blogPath?.props.siblings.en?.original.data.title)
      .toBe("Post EN")
  })

  it("includes sibling translations for talk entries", async () => {
    const result = await getStaticPathsEntries(
      routes,
      fetchCollection,
      locales,
    )

    const talkPath = result.find(
      path =>
        path.props.section === "talk" &&
        path.params.locale === "es",
    )

    expect(talkPath?.props.siblings.es?.original.data.title)
      .toBe("Charla ES")

    expect(talkPath?.props.siblings.en?.original.data.title)
      .toBe("Talk EN")
  })

  it("fetches every configured collection", async () => {
    await getStaticPathsEntries(
      routes,
      fetchCollection,
      locales,
    )

    expect(fetchCollection).toHaveBeenCalledWith("blog")
    expect(fetchCollection).toHaveBeenCalledWith("talk")
    expect(fetchCollection).toHaveBeenCalledTimes(2)
  })
})
