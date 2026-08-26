/**
 * Strangler-fig shim that re-exports TranslationLink types and helpers bound
 * to the application's UI languages.
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
