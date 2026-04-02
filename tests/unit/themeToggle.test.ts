/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@utils/giscus', () => ({ sendMessage: vi.fn() }))
import * as themeToggle from '@utils/themeToggle'
import { getDocumentTheme, applyTheme } from '@utils/themeToggle'

const { handleToggleClick, initThemeToggle } = themeToggle
let setGiscusSpy: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  document.documentElement.className = 'light'
  localStorage.clear()
  setGiscusSpy = vi.spyOn(themeToggle, 'setGiscusTheme')
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
  it("switches to 'dark' from 'light', calls setGiscusTheme and closeSidebar", () => {
    const closeSpy = vi.spyOn(themeToggle, 'closeSidebar')
    handleToggleClick()

    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('theme')).toBe('dark')
    expect(setGiscusSpy).toHaveBeenCalledWith('dark')
    expect(closeSpy).toHaveBeenCalled()
  })

  it("switches to 'light' from 'dark'", () => {
    document.documentElement.className = 'dark'
    handleToggleClick()

    expect(document.documentElement.classList.contains('light')).toBe(true)
    expect(localStorage.getItem('theme')).toBe('light')
    expect(setGiscusSpy).toHaveBeenCalledWith('light')
  })

  it("defaults to 'dark' when no theme class is set", () => {
    document.documentElement.className = ''
    handleToggleClick()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})

describe('initThemeToggle', () => {
  it('attaches click listener to button', () => {
    const btn = document.createElement('button')
    const addSpy = vi.spyOn(btn, 'addEventListener')
    initThemeToggle(btn)
    expect(addSpy).toHaveBeenCalledWith('click', expect.any(Function))
  })

  it('returns a teardown that removes the listener', () => {
    const btn = document.createElement('button')
    const removeSpy = vi.spyOn(btn, 'removeEventListener')
    const teardown = initThemeToggle(btn)
    teardown()
    expect(removeSpy).toHaveBeenCalledWith('click', expect.any(Function))
  })

  it('does not throw when button is null', () => {
    expect(() => initThemeToggle(null)).not.toThrow()
  })
})
