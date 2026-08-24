import { ui, defaultLang, type UILanguages } from './ui'
import { showDefaultLang } from '@i18n/config'

/**
 * Crea una función traductora ligada a un idioma concreto.
 * La función devuelta recibe una clave y devuelve la cadena localizada.
 * @param lang - Idioma a usar para las traducciones
 * @returns Función `t(key)` que devuelve la traducción
 */
export function useTranslations(lang: UILanguages) {
  return function t(key: keyof typeof ui[typeof lang]) {
    return ui[lang][key]
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
