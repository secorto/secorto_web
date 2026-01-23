import type { UILanguages } from './ui'
import { languages, defaultLang, showDefaultLang } from './ui'
import { resolveLocalized } from './rootMap'
import { translations } from './translations'

interface EntryMeta {
  noTranslate?: string[]
}

export interface TranslationLink {
  href: string
  label: string
  title?: string
  aria?: string
  isAvailable: boolean
  disabledReason?: 'not-available' | 'no-translate'
  marker?: string
}

type PageType = 'home' | 'tags' | 'detail' | 'collection-index'

interface PageContext {
  type: PageType
  canonicalSection: string
  slug: string
}

export const DISABLED_REASON_CONFIG: Record<'not-available' | 'no-translate', {
  marker: string
  title: string
}> = {
  'not-available': {
    marker: '⌛',
    title: 'La traducción no está disponible todavía'
  },
  'no-translate': {
    marker: '🔒',
    title: 'Esta publicación no será traducida'
  }
}

function buildLangPrefix(targetLang: UILanguages): string {
  return targetLang === defaultLang && !showDefaultLang ? "" : `/${targetLang}`
}

function getDisabledReasonForLang(targetLang: UILanguages, slug: string, canonicalSection: string): 'not-available' | 'no-translate' {
  const meta = translations[canonicalSection as keyof typeof translations]?.[slug] as EntryMeta | undefined
  const willNotBeTranslated = Array.isArray(meta?.noTranslate) && meta!.noTranslate!.includes(targetLang)
  return willNotBeTranslated ? 'no-translate' : 'not-available'
}

function buildHomePageLink(targetLang: UILanguages): TranslationLink {
  return {
    href: `${buildLangPrefix(targetLang)}/`,
    label: languages[targetLang],
    isAvailable: true
  }
}

function buildTagPageLink(targetLang: UILanguages, canonicalSection: string, slug: string): TranslationLink {
  const localizedSection = resolveLocalized(canonicalSection, targetLang)
  return {
    href: `${buildLangPrefix(targetLang)}/${localizedSection}/${slug}`,
    label: languages[targetLang],
    isAvailable: true
  }
}

function buildDetailPageLink(targetLang: UILanguages, canonicalSection: string, slug: string, availableLocales: Record<string, any>): TranslationLink {
  const entry = availableLocales[targetLang]
  const localizedSection = resolveLocalized(canonicalSection, targetLang)

  if (!entry) {
    const disabledReason = getDisabledReasonForLang(targetLang, slug, canonicalSection)
    const config = DISABLED_REASON_CONFIG[disabledReason]

    return {
      href: '',
      label: languages[targetLang],
      isAvailable: false,
      disabledReason,
      marker: config.marker,
      title: config.title,
      aria: `${config.title}: ${languages[targetLang]}`
    }
  }

  return {
    href: `${buildLangPrefix(targetLang)}/${localizedSection}/${entry.slug}`,
    label: languages[targetLang],
    isAvailable: true
  }
}

function buildCollectionIndexLink(targetLang: UILanguages, canonicalSection: string): TranslationLink {
  const localizedSection = resolveLocalized(canonicalSection, targetLang)
  return {
    href: `${buildLangPrefix(targetLang)}/${localizedSection}`,
    label: languages[targetLang],
    isAvailable: true
  }
}

export function buildTranslationLink(targetLang: UILanguages, pageContext: PageContext, availableLocales: Record<string, any>): TranslationLink {
  switch (pageContext.type) {
    case 'home':
      return buildHomePageLink(targetLang)
    case 'tags':
      return buildTagPageLink(targetLang, pageContext.canonicalSection, pageContext.slug)
    case 'detail':
      return buildDetailPageLink(targetLang, pageContext.canonicalSection, pageContext.slug, availableLocales)
    case 'collection-index':
      return buildCollectionIndexLink(targetLang, pageContext.canonicalSection)
  }
}
