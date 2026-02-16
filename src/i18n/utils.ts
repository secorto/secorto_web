import { ui, defaultLang, showDefaultLang, type UILanguages } from './ui'
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
  if (lang in ui) return lang as UILanguages
  return defaultLang
}

/**
 * Crea una función traductora ligada a un idioma concreto.
 * La función devuelta recibe una clave y devuelve la cadena localizada,
 * con fallback al `defaultLang` si falta la traducción.
 * @param lang - Idioma a usar para las traducciones
 * @returns Función `t(key)` que devuelve la traducción
 */
export function useTranslations(lang: UILanguages) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key]
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
