import { sendMessage } from '@utils/giscus'

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
 * @param {Theme} theme Tema a aplicar en Giscus
 */
export function setGiscusTheme(theme: Theme): void {
  sendMessage({ setConfig: { theme } })
}

/**
 * Cierra la barra lateral removiendo la clase `sidebar-open` de los toggles.
 * @param {Document} [doc=document] Documento en el que operar (útil para tests)
 */
export function closeSidebar(doc: Document = document): void {
  doc.querySelectorAll('.sidebar-toggle, .hamburger')
    .forEach(el => el.classList.remove('sidebar-open'))
}

/**
 * Lee el tema aplicado en el elemento `documentElement`.
 * @param {Document} [doc=document] Documento en el que buscar el tema
 * @returns {Theme | null} Tema actual si está presente, o `null` si no hay ninguno
 */
export function getDocumentTheme(doc: Document = document): Theme | null {
  const el = doc.documentElement
  return THEME_CLASSES.find(t => el.classList.contains(t)) ?? null
}

/**
 * Aplica el tema en el `documentElement`, actualiza `localStorage` y
 * asegura que solo exista la clase del tema activo.
 * @param {Theme} theme Tema a aplicar
 * @param {Document} [doc=document] Documento donde aplicar el tema
 */
export function applyTheme(theme: Theme, doc: Document = document): void {
  const el = doc.documentElement
  el.classList.remove(...THEME_CLASSES)
  el.classList.add(theme)
  localStorage.setItem('theme', theme)
}

/**
 * Maneja el clic del toggle de tema: alterna entre `dark` y `light`, aplica
 * el tema, sincroniza Giscus y cierra la sidebar.
 * @param {Document} [doc=document] Documento donde realizar las operaciones
 */
export function handleToggleClick(doc: Document = document): void {
  const current = getDocumentTheme(doc)
  const next: Theme = current === THEMES.dark ? THEMES.light : THEMES.dark
  applyTheme(next, doc)
  setGiscusTheme(next)
  closeSidebar(doc)
}

/**
 * Inicializa el listener de clic en el botón toggle de tema.
 * No retorna nada — el caller no obtiene un teardown.
 * @param {HTMLElement | null} button Elemento botón (o `null` si no existe)
 */
export function initThemeToggle(button: HTMLElement | null): void {
  if (!button) return
  const listener: EventListener = () => handleToggleClick()
  button.addEventListener('click', listener)
}
