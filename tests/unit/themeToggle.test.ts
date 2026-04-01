/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@utils/giscus', () => ({ setGiscusTheme: vi.fn() }))
import { setGiscusTheme } from '@utils/giscus'
import { handleToggleClick } from '@utils/themeToggle'
import { initThemeToggle } from '@utils/themeToggle'

describe('handleToggleClick', () => {
  beforeEach(() => {
    document.documentElement.className = 'light'
    localStorage.clear()
    // ensure sidebar elements exist
    const sidebar = document.createElement('div')
    sidebar.className = 'sidebar-toggle sidebar-open'
    document.body.appendChild(sidebar)
    const ham = document.createElement('div')
    ham.className = 'hamburger sidebar-open'
    document.body.appendChild(ham)
    vi.clearAllMocks()
  })

  it('toggles theme, sets localStorage and calls setGiscusTheme', () => {
    handleToggleClick()

    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('theme')).toBe('dark')
    expect(setGiscusTheme).toHaveBeenCalledWith('dark')
    expect(document.querySelector('.sidebar-toggle')?.classList.contains('sidebar-open')).toBe(false)
    expect(document.querySelector('.hamburger')?.classList.contains('sidebar-open')).toBe(false)
  })

  it("toggles to 'light' when starting from 'dark'", () => {
    document.documentElement.className = 'dark'
    handleToggleClick()

    expect(document.documentElement.classList.contains('light')).toBe(true)
    expect(localStorage.getItem('theme')).toBe('light')
    expect(setGiscusTheme).toHaveBeenCalledWith('light')
  })

  it('initThemeToggle attaches click listener and does nothing when null', () => {
    const btn = document.createElement('button')
    const addSpy = vi.spyOn(btn, 'addEventListener')
    initThemeToggle(btn)
    expect(addSpy).toHaveBeenCalledWith('click', expect.any(Function))

    // null button should not throw
    expect(() => initThemeToggle(null)).not.toThrow()
  })
})
