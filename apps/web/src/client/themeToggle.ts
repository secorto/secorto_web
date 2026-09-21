import { sendMessage } from '@client/giscus'
import { closeSidebar } from './sidebar'

/**
 * Objeto con los nombres de los temas soportados.
 * Mantener como `const` para permitir inferencia de tipos literal.
 */
export const THEMES = {
  dark: 'dark',
  light: 'light',
} as const

/**
 * Tipo union con los temas disponibles.
 */
export type Theme = typeof THEMES[keyof typeof THEMES]

const THEME_CLASSES = Object.values(THEMES) satisfies Theme[]

/**
 * Envía el tema actual al widget de Giscus para sincronizar su apariencia.
 * @param theme Tema a aplicar en Giscus
 */
export function setGiscusTheme(theme: Theme): void {
  sendMessage({ setConfig: { theme } })
}

/**
 * Lee el tema aplicado en el elemento `documentElement` (clase HTML).
 * @param doc Documento en el que buscar el tema
 * @returns Tema actual si está presente, o `null` si no hay ninguno
 */
export function getDocumentTheme(doc: Document = document): Theme | null {
  const el = doc.documentElement
  return THEME_CLASSES.find(t => el.classList.contains(t)) ?? null
}

/**
 * Aplica el tema en el `documentElement` (clase HTML) y su atributo `data-theme`.
 * Intenta actualizar `localStorage`. El FOUC ya establece estos valores, esto los sincroniza
 * cuando el usuario alterna el tema. Si localStorage no está disponible, continúa con la
 * aplicación del tema en el DOM.
 * @param theme Tema a aplicar
 * @param doc Documento donde aplicar el tema
 */
export function applyTheme(theme: Theme, doc: Document = document): void {
  // Aplicar clase y data-theme en html
  // - Clase: para compatibilidad con expressiveCode
  // - data-theme: para Mermaid y otros componentes
  const el = doc.documentElement
  el.classList.remove(...THEME_CLASSES)
  el.classList.add(theme)
  el.dataset.theme = theme

  try {
    localStorage.setItem('theme', theme)
  } catch (e) {
    console.debug('[Theme] localStorage.setItem failed in applyTheme, theme applied to DOM only:', e)
  }
}

/**
 * Maneja el clic del toggle de tema: alterna entre `dark` y `light`, aplica
 * el tema, sincroniza Giscus y cierra la sidebar.
 * @param doc Documento donde realizar las operaciones
 */
export function handleToggleClick(doc: Document = document): void {
  const current = getDocumentTheme(doc)
  const next: Theme = current === THEMES.dark ? THEMES.light : THEMES.dark
  applyTheme(next, doc)
  setGiscusTheme(next)
  closeSidebar(doc)
}

/**
 * Inicializa el listener de clic en el botón toggle de tema y sincroniza
 * el `data-theme` del documentElement con la clase actual.
 * No retorna nada — el caller no obtiene un teardown.
 * @param button Elemento botón (o `null` si no existe)
 */
export function initThemeToggle(button: HTMLElement | null): void {
  if (!button) return

  // Usar ownerDocument del botón para mantener consistencia con otros contextos de documento
  const doc = button.ownerDocument

  // Sincronizar data-theme en documentElement basado en la clase HTML actual
  const currentTheme = getDocumentTheme(doc)
  if (currentTheme) {
    doc.documentElement.dataset.theme = currentTheme
  }

  const listener: EventListener = () => handleToggleClick(doc)
  button.addEventListener('click', listener)
}
