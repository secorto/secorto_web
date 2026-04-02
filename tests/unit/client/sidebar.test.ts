/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'

import { closeSidebar, openSidebar, toggleSidebar, initSidebar } from '@client/sidebar'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('sidebar helpers', () => {
  it('openSidebar adds sidebar-open to sidebar and hamburger when present', () => {
    const sidebar = document.createElement('nav')
    sidebar.className = 'sidebar-toggle'
    const hamburger = document.createElement('button')
    hamburger.className = 'hamburger'
    document.body.appendChild(sidebar)
    document.body.appendChild(hamburger)

    openSidebar()

    expect(sidebar.classList.contains('sidebar-open')).toBe(true)
    expect(hamburger.classList.contains('sidebar-open')).toBe(true)
  })

  it('closeSidebar removes sidebar-open from elements when present', () => {
    const sidebar = document.createElement('nav')
    sidebar.className = 'sidebar-toggle sidebar-open'
    const hamburger = document.createElement('button')
    hamburger.className = 'hamburger sidebar-open'
    document.body.appendChild(sidebar)
    document.body.appendChild(hamburger)

    closeSidebar()

    expect(sidebar.classList.contains('sidebar-open')).toBe(false)
    expect(hamburger.classList.contains('sidebar-open')).toBe(false)
  })

  it('toggleSidebar opens when sidebar closed and closes when open', () => {
    const sidebar = document.createElement('nav')
    sidebar.className = 'sidebar-toggle'
    document.body.appendChild(sidebar)

    // closed -> open
    toggleSidebar()
    expect(sidebar.classList.contains('sidebar-open')).toBe(true)

    // open -> closed
    toggleSidebar()
    expect(sidebar.classList.contains('sidebar-open')).toBe(false)
  })

  it('toggleSidebar does nothing when sidebar is missing', () => {
    // should not throw
    expect(() => toggleSidebar()).not.toThrow()
  })

  it('initSidebar attaches click listener and toggle on click', () => {
    const btn = document.createElement('button')
    btn.className = 'hamburger'
    document.body.appendChild(btn)
    const sidebar = document.createElement('nav')
    sidebar.className = 'sidebar-toggle'
    document.body.appendChild(sidebar)

    const addSpy = vi.spyOn(btn, 'addEventListener')
    initSidebar(btn)
    expect(addSpy).toHaveBeenCalledWith('click', expect.any(Function))

    // clicking the button should toggle the sidebar
    btn.click()
    expect(sidebar.classList.contains('sidebar-open')).toBe(true)
  })

  it('initSidebar does not throw when button is null', () => {
    expect(() => initSidebar(null)).not.toThrow()
  })
})
