import { setGiscusTheme } from '@utils/giscus'

export function handleToggleClick(): void {
  const element = document.documentElement
  element.classList.toggle('dark')
  element.classList.toggle('light')

  const isDark = element.classList.contains('dark')
  const theme = isDark ? 'dark' : 'light'
  localStorage.setItem('theme', theme)
  setGiscusTheme(theme)
  document.querySelector('.sidebar-toggle')?.classList.remove('sidebar-open')
  document.querySelector('.hamburger')?.classList.remove('sidebar-open')
}

export function initThemeToggle(button: HTMLElement | null): void {
  if (!button) return
  button.addEventListener('click', handleToggleClick)
}
