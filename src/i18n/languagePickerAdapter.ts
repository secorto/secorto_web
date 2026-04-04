import type { TranslationLink } from '@domain/translationLink'
import { isAccessible, isAvailable } from '@domain/translationLink'
import { languages, icons as uiIcons, ui as uiStrings } from '@i18n/ui'
import type { UILanguages } from '@i18n/ui'

export type LanguagePickerItem = {
  locale: UILanguages
  label: string
  text: string
  title?: string
  reason: 'missing' | 'draft' | ''
  reasonId?: string
  href: string | null
  accessible: boolean
}

const reasonMeta = {
  missing: { marker: uiIcons.missing, titleKey: 'translation.disabled.missing' as const },
  draft: { marker: uiIcons.draft, titleKey: 'translation.disabled.draft' as const },
}

type Reason = keyof typeof reasonMeta

function buildLanguagePickerMeta(l: TranslationLink) {
  const label = languages[l.locale]

  if (isAvailable(l)) {
    return { label, reason: '' as const, meta: undefined, text: label, title: undefined, reasonId: undefined }
  }

  const reason = l.type as Reason
  const meta = reasonMeta[reason]
  const text = `${label} ${meta.marker}`
  const title = uiStrings[l.locale][meta.titleKey]
  const reasonId = `lang-${l.locale}-reason`

  return { label, reason, meta, text, title, reasonId }
}

export function adaptLanguageLinks(links: TranslationLink[]): LanguagePickerItem[] {
  return links.map((l) => {
    const { label, reason, text, title, reasonId } = buildLanguagePickerMeta(l)

    return {
      locale: l.locale,
      label,
      text,
      title,
      reason,
      reasonId,
      href: l.href,
      accessible: isAccessible(l),
    }
  })
}
