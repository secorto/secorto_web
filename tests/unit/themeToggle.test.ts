import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@utils/giscus', () => ({ setGiscusTheme: vi.fn() }))
import { setGiscusTheme } from '@utils/giscus'
import { handleToggleClick } from '@utils/themeToggle'

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
})
