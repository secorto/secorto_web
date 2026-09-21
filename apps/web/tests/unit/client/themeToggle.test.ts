/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@client/giscus', () => ({ sendMessage: vi.fn() }))
import { sendMessage } from '@client/giscus'
import * as themeToggle from '@client/themeToggle'
import { getDocumentTheme, applyTheme } from '@client/themeToggle'



beforeEach(() => {
  document.documentElement.className = 'light'
  document.documentElement.dataset.theme = 'light'
  localStorage.clear()
  vi.clearAllMocks()
})

describe('getDocumentTheme', () => {
  it("returns 'light' when documentElement has class 'light'", () => {
    expect(getDocumentTheme()).toBe('light')
  })

  it("returns 'dark' when documentElement has class 'dark'", () => {
    document.documentElement.className = 'dark'
    expect(getDocumentTheme()).toBe('dark')
  })

  it('returns null when no theme class is present', () => {
    document.documentElement.className = ''
    expect(getDocumentTheme()).toBeNull()
  })
})

describe('applyTheme', () => {
  it("sets 'dark' class and data-theme, persists to localStorage", () => {
    applyTheme('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.classList.contains('light')).toBe(false)
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it("sets 'light' class and data-theme, persists to localStorage", () => {
    document.documentElement.className = 'dark'
    document.body.dataset.theme = 'dark'
    applyTheme('light')
    expect(document.documentElement.classList.contains('light')).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(localStorage.getItem('theme')).toBe('light')
  })
})

describe('handleToggleClick', () => {
  it("switches to 'dark' from 'light', updates both class and data-theme", () => {
    const sidebarBtn = document.createElement('button')
    sidebarBtn.className = 'sidebar-toggle sidebar-open'
    document.body.appendChild(sidebarBtn)
    themeToggle.handleToggleClick()

    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem('theme')).toBe('dark')
    expect(sendMessage).toHaveBeenCalledWith({ setConfig: { theme: 'dark' } })
    expect(sidebarBtn.classList.contains('sidebar-open')).toBe(false)
    sidebarBtn.remove()
  })

  it("switches to 'light' from 'dark', updates both class and data-theme", () => {
    document.documentElement.className = 'dark'
    document.body.dataset.theme = 'dark'
    themeToggle.handleToggleClick()

    expect(document.documentElement.classList.contains('light')).toBe(true)
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(localStorage.getItem('theme')).toBe('light')
    expect(sendMessage).toHaveBeenCalledWith({ setConfig: { theme: 'light' } })
  })

  it("defaults to 'dark' when no theme class is set", () => {
    document.documentElement.className = ''
    themeToggle.handleToggleClick()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
})

describe('initThemeToggle', () => {
  it('attaches click listener to button', () => {
    const btn = document.createElement('button')
    const addSpy = vi.spyOn(btn, 'addEventListener')
    themeToggle.initThemeToggle(btn)
    expect(addSpy).toHaveBeenCalledWith('click', expect.any(Function))
  })

  it('does not return a teardown (void) and does not call removeEventListener', () => {
    const btn = document.createElement('button')
    const removeSpy = vi.spyOn(btn, 'removeEventListener')
    const res = themeToggle.initThemeToggle(btn)
    expect(res).toBeUndefined()
    expect(removeSpy).not.toHaveBeenCalled()
  })

  it('click on button triggers the toggle handler and applies both class and data-theme', () => {
    const btn = document.createElement('button')
    document.body.appendChild(btn)
    themeToggle.initThemeToggle(btn)
    btn.click()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem('theme')).toBe('dark')
    expect(sendMessage).toHaveBeenCalledWith({ setConfig: { theme: 'dark' } })
    btn.remove()
  })

  it('does not throw when button is null', () => {
    expect(() => themeToggle.initThemeToggle(null)).not.toThrow()
  })
})
