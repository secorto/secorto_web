import { sendMessage } from '@utils/giscus'

export const THEMES = {
  dark: 'dark',
  light: 'light',
} as const

export type Theme = typeof THEMES[keyof typeof THEMES]

const THEME_CLASSES = Object.values(THEMES) satisfies Theme[]

export function setGiscusTheme(theme: Theme): void {
  sendMessage({ setConfig: { theme } })
}

export function closeSidebar(doc: Document = document): void {
  doc.querySelectorAll('.sidebar-toggle, .hamburger')
    .forEach(el => el.classList.remove('sidebar-open'))
}

export function getDocumentTheme(doc: Document = document): Theme | null {
  const el = doc.documentElement
  return THEME_CLASSES.find(t => el.classList.contains(t)) ?? null
}

export function applyTheme(theme: Theme, doc: Document = document): void {
  const el = doc.documentElement
  el.classList.remove(...THEME_CLASSES)
  el.classList.add(theme)
  localStorage.setItem('theme', theme)
}

export function handleToggleClick(doc: Document = document): void {
  const current = getDocumentTheme(doc)
  const next: Theme = current === THEMES.dark ? THEMES.light : THEMES.dark
  applyTheme(next, doc)
  setGiscusTheme(next)
  closeSidebar(doc)
}

export function initThemeToggle(button: HTMLElement | null): () => void {
  if (!button) return () => undefined
  const listener = () => handleToggleClick()
  button.addEventListener('click', listener)
  return () => button.removeEventListener('click', listener)
}
