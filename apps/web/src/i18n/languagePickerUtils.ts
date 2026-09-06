import type { TranslationLink } from '@domain/translationLink'
import { missingLink } from '@domain/translationLink'
import { languages } from './ui'

/**
 * Build language links where every locale is intentionally unavailable.
 * Useful for routes that should show locked translation states (e.g. 404 pages).
 */
export function buildMissingLanguageLinks(): TranslationLink[] {
  return languages.all.map(l => missingLink(l))
}
