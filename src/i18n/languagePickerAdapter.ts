import type { TranslationLink } from '@domain/translationLink'
import { languages, icons as uiIcons, ui as uiStrings } from '@i18n/ui'
import type { UILanguages } from '@i18n/ui'

export type LanguagePickerItem =
  | {
      locale: UILanguages
      label: string
      text: string
      title: undefined,
      reason: ''
      href: string
      accessible: true
    }
  | {
      locale: UILanguages
      label: string
      text: string
      title: string
      reason: 'draft'
      href: string
      accessible: true
    }
  | {
      locale: UILanguages
      label: string
      text: string
      title: string
      reason: 'missing'
      href: null
      accessible: false
    }

const reasonMeta = {
  missing: { marker: uiIcons.missing, titleKey: 'translation.disabled.missing' as const },
  draft: { marker: uiIcons.draft, titleKey: 'translation.disabled.draft' as const },
}

function buildLanguagePickerMeta(l: TranslationLink): LanguagePickerItem {
  const label = languages[l.locale]

  if (l.type === 'available') {
    return {
      locale: l.locale,
      label,
      text: label,
      title: undefined,
      reason: '',
      href: l.href,
      accessible: true,
    }
  }

  const meta = reasonMeta[l.type]
  const text = `${label} ${meta.marker}`
  const title = uiStrings[l.locale][meta.titleKey]
  if (l.type === 'draft') {
    return {
      locale: l.locale,
      label,
      text,
      title,
      reason: 'draft',
      href: l.href,
      accessible: true,
    }
  }

  return {
    locale: l.locale,
    label,
    text,
    title,
    reason: 'missing',
    href: null,
    accessible: false,
  }
}

export function adaptLanguageLinks(links: TranslationLink[]): LanguagePickerItem[] {
  return links.map((l) => buildLanguagePickerMeta(l))
}
