import { ui, defaultLang } from './ui';

export function useTranslations(lang: string = 'es') {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    // @ts-ignore
    return ui[lang][key] || ui[defaultLang][key];
  }
}
