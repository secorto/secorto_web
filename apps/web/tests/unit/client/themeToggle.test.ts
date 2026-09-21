/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('@client/giscus', () => ({ sendMessage: vi.fn() }))
import { sendMessage } from '@client/giscus'
import * as themeToggle from '@client/themeToggle'
import { getDocumentTheme, applyTheme, getInitialTheme } from '@client/themeToggle'



beforeEach(() => {
  document.documentElement.className = 'light'
  document.documentElement.dataset.theme = 'light'
  localStorage.clear()
  vi.clearAllMocks()
})

afterEach(() => {
  vi.restoreAllMocks()
})

function createMockMediaQueryList(matches: boolean, media = '(prefers-color-scheme: dark)'): Partial<MediaQueryList> {
  return {
    matches,
    media,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }
}

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

describe('getInitialTheme', () => {
  it("returns 'dark' from localStorage when set", () => {
    localStorage.setItem('theme', 'dark')
    expect(getInitialTheme()).toBe('dark')
  })

  it("returns 'light' from localStorage when set", () => {
    localStorage.setItem('theme', 'light')
    expect(getInitialTheme()).toBe('light')
  })

  it("returns 'dark' when localStorage is empty and system prefers dark", () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(createMockMediaQueryList(true)))
    expect(getInitialTheme()).toBe('dark')
  })

  it("returns 'light' as default when localStorage is empty and system prefers light", () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(createMockMediaQueryList(false)))
    expect(getInitialTheme()).toBe('light')
  })

  it('ignores invalid localStorage values and falls back to matchMedia', () => {
    localStorage.setItem('theme', 'invalid-theme')
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(createMockMediaQueryList(true)))
    expect(getInitialTheme()).toBe('dark')
  })
})

describe('applyTheme', () => {
  it("adds 'dark' and removes 'light', persists to localStorage, sets data-theme", () => {
    applyTheme('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.classList.contains('light')).toBe(false)
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it("adds 'light' and removes 'dark', persists to localStorage, sets data-theme", () => {
    document.documentElement.className = 'dark'
    document.documentElement.setAttribute('data-theme', 'dark')
    applyTheme('light')
    expect(document.documentElement.classList.contains('light')).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    expect(localStorage.getItem('theme')).toBe('light')
  })

  it('applies theme to DOM even when localStorage throws QuotaExceededError', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })
    applyTheme('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    setItemSpy.mockRestore()
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
    document.documentElement.dataset.theme = 'dark'
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

  it('skips data-theme sync when no theme class is set', () => {
    document.documentElement.className = ''
    delete document.documentElement.dataset.theme
    const btn = document.createElement('button')
    themeToggle.initThemeToggle(btn)
    expect(document.documentElement.dataset.theme).toBeUndefined()
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
