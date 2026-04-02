/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@utils/giscus', () => ({ sendMessage: vi.fn() }))
import { sendMessage } from '@utils/giscus'
import * as themeToggle from '@utils/themeToggle'
import { getDocumentTheme, applyTheme } from '@utils/themeToggle'



beforeEach(() => {
  document.documentElement.className = 'light'
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
  it("adds 'dark' and removes 'light', persists to localStorage", () => {
    applyTheme('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.classList.contains('light')).toBe(false)
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it("adds 'light' and removes 'dark', persists to localStorage", () => {
    document.documentElement.className = 'dark'
    applyTheme('light')
    expect(document.documentElement.classList.contains('light')).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(localStorage.getItem('theme')).toBe('light')
  })
})

describe('handleToggleClick', () => {
  it("switches to 'dark' from 'light', calls setGiscusTheme and closes sidebar elements", () => {
    // preparar un elemento que represente un toggle abierto
    const sidebarBtn = document.createElement('button')
    sidebarBtn.className = 'sidebar-toggle sidebar-open'
    document.body.appendChild(sidebarBtn)
    themeToggle.handleToggleClick()

    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('theme')).toBe('dark')
    expect(sendMessage).toHaveBeenCalledWith({ setConfig: { theme: 'dark' } })
    expect(sidebarBtn.classList.contains('sidebar-open')).toBe(false)
    sidebarBtn.remove()
  })

  it("switches to 'light' from 'dark'", () => {
    document.documentElement.className = 'dark'
    themeToggle.handleToggleClick()

    expect(document.documentElement.classList.contains('light')).toBe(true)
    expect(localStorage.getItem('theme')).toBe('light')
    expect(sendMessage).toHaveBeenCalledWith({ setConfig: { theme: 'light' } })
  })

  it("defaults to 'dark' when no theme class is set", () => {
    document.documentElement.className = ''
    themeToggle.handleToggleClick()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
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

  it('click on button triggers the toggle handler and applies theme', () => {
    const btn = document.createElement('button')
    document.body.appendChild(btn)
    themeToggle.initThemeToggle(btn)
    btn.click()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('theme')).toBe('dark')
    expect(sendMessage).toHaveBeenCalledWith({ setConfig: { theme: 'dark' } })
    btn.remove()
  })

  it('does not throw when button is null', () => {
    expect(() => themeToggle.initThemeToggle(null)).not.toThrow()
  })
})
