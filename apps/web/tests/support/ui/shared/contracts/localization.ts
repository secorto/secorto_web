import type { UILanguages } from '@i18n/ui'
import type { Verification } from '@tests/step'

export interface Loadable {
  shouldBeLoaded(): Verification<void>
}

export interface LocalizedPage<T = void> {
  shouldBeLocalized(locale: UILanguages): Verification<T>
}

export interface LocalizedUrl {
  shouldBeInLocale(locale: UILanguages): Verification<void>
}
