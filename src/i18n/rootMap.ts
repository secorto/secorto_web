import type { UILanguages } from "./ui";

// Solo defines las secciones que cambian entre idiomas.
// Todo lo demás (ej. "about", "newPage") se resuelve a sí mismo automáticamente.
export const rootMap: Record<string, Record<UILanguages, string>> = {
  //work: { en: "work", es: "trabajo" },
  //projects: { en: "projects", es: "proyecto" },
  //talk: { en: "talk", es: "charla" },
};

export function resolveCanonical(raw: string, lang: UILanguages): string {
  const entry = Object.entries(rootMap).find(
    ([, langs]) => langs[lang] === raw
  );
  return entry ? entry[0] : raw; // fallback: raw si no está en el mapa
}

export function resolveLocalized(canonical: string, lang: UILanguages): string {
  const map = rootMap[canonical];
  return map ? map[lang] : canonical; // fallback: canonical si no está en el mapa
}
