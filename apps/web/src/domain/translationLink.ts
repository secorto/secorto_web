/**
 * Strangler-fig shim: re-exports generic TranslationLink types and constructors
 * from @secorto/i18n, and provides a site-specific `resolveDefaultAccessibleLink`
 * with `defaultLang` already bound so all existing call sites are unaffected.
 */
import { type UILanguages } from '@i18n/ui'
import {
  type TranslationLink as LibTranslationLink
} from '@secorto/i18n'

export type TranslationLink = LibTranslationLink<UILanguages>

export type {
  AvailableLink,
  MissingLink,
  DraftLink,
  AccessibleTranslationLink,
} from '@secorto/i18n'

export {
  availableLink,
  missingLink,
  draftLink,
  isAccessible,
  isAvailable,
  isDraft,
  isMissing,
} from '@secorto/i18n'
