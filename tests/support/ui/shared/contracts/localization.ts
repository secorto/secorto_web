import type { UILanguages } from "@i18n/ui";
import type { Verification } from "@tests/fixtures";

export interface LocalizedPage<T = void> {
  shouldBeLoaded(locale: UILanguages): Verification<T>
}

export interface LocalizedUrl {
  shouldBeInLocale(locale: UILanguages): Verification<void>
}
