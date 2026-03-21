import type { UILanguages } from './ui'
import { sectionsConfig } from '@domain/section'

// Construir el mapa automáticamente a partir de sectionsConfig para evitar duplicación
// Rutas adicionales (páginas estáticas) que no forman parte de `sectionsConfig`
const extraRoutes: Record<string, Record<UILanguages, string>> = {
  // canonicalKey: { en: 'english-slug', es: 'spanish-slug' }
  about: { en: 'about', es: 'acerca-de' },
  tags: { en: 'tags', es: 'tags' },
}

export const rootMap: Record<string, Record<UILanguages, string>> = Object.fromEntries(
  Object.entries(sectionsConfig)
    .map(([key, cfg]) => [key, cfg.routes])
    .concat(Object.entries(extraRoutes))
) as Record<string, Record<UILanguages, string>>

export function findCanonicalSectionKey(raw: string, lang: UILanguages): string {
  const entry = Object.entries(rootMap).find(([, langs]) => langs[lang] === raw)
  return entry ? entry[0] : raw
}

export function resolveLocalized(canonical: string, lang: UILanguages): string {
  const map = rootMap[canonical]
  return map ? map[lang] : canonical // fallback: canonical si no está en el mapa
}
