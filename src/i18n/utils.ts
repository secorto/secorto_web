import { ui, defaultLang, showDefaultLang } from './ui';
import { full, monthYear } from '@i18n/dateFormat';

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  }
}

export function useTranslatedPath(lang: keyof typeof ui) {
  return function translatePath(path: string, l: string = lang) {
    return !showDefaultLang && l === defaultLang ? path : `/${l}${path}`
  }
}

export function getFullFormat(url: URL): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(getLangFromUrl(url), full);
}

export function getMonthYearFormat(url: URL): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(getLangFromUrl(url), monthYear);
}
