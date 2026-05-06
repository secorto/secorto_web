import { ui, defaultLang, type UILanguages, languageKeys } from './ui'
import { showDefaultLang } from '@i18n/config'
import { full, monthYear } from '@i18n/dateFormat'

/**
 * Obtiene el idioma a partir de la URL.
 * Si el primer segmento de la ruta no corresponde a un idioma conocido,
 * retorna el idioma por defecto.
 * @param url - URL actual
 * @returns Idioma detectado (tipo `UILanguages`)
 */
export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/')
  const possiblyLang = lang as UILanguages
  if (languageKeys.includes(possiblyLang)) {
    return possiblyLang
  }
  return defaultLang
}

/**
 * Crea una función traductora ligada a un idioma concreto.
 * La función devuelta recibe una clave y devuelve la cadena localizada,
 * @param lang - Idioma a usar para las traducciones
 * @returns Función `t(key)` que devuelve la traducción
 */
export function useTranslations(lang: UILanguages) {
  return function t(key: keyof typeof ui[typeof lang]) {
    return ui[lang][key]
  }
}

/**
 * Convierte una cadena en un valor válido de `UILanguages`.
 *
 * @param lang - Código de idioma a validar (por ejemplo `'es'`, `'en'`) o `undefined`
 * @returns `lang` como `UILanguages` si es válido
 * @throws {TypeError} si `lang` es `undefined` o no corresponde a un idioma soportado
 *
 * Ejemplo:
 * ```ts
 * langFromString('en') // 'en'
 * langFromString(undefined) // throws TypeError
 * ```
 */
export function langFromString(lang: string | undefined) {
  const possiblyLang = lang as UILanguages
  if (languageKeys.includes(possiblyLang)) {
    return possiblyLang
  } else {
    throw new TypeError(`Invalid language: ${lang}`)
  }
}

/**
 * Crea un generador de rutas localizadas.
 * Si `showDefaultLang` es false y el idioma es el por defecto, devuelve
 * la ruta sin prefijo; en caso contrario, devuelve la ruta con `/{lang}`.
 * @param lang - Idioma por defecto para la función devuelta
 * @returns Función `translatePath(path, l?)` que aplica el prefijo de idioma
 */
export function useTranslatedPath(lang: UILanguages) {
  return function translatePath(path: string, l: string = lang) {
    return !showDefaultLang && l === defaultLang ? path : `/${l}${path}`
  }
}

/**
 * Formateador de fecha completo según el idioma extraído de la URL.
 * @param url - URL actual (se usa para detectar idioma)
 * @returns Instancia de `Intl.DateTimeFormat` con el formato `full`
 */
export function getFullFormat(url: URL): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(getLangFromUrl(url), full)
}

/**
 * Formateador de mes y año según el idioma extraído de la URL.
 * @param url - URL actual (se usa para detectar idioma)
 * @returns Instancia de `Intl.DateTimeFormat` con el formato `monthYear`
 */
export function getMonthYearFormat(url: URL): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(getLangFromUrl(url), monthYear)
}
