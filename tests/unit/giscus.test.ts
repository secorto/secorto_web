/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { sendMessage } from '@utils/giscus'

declare global {
  interface Window {
    __last?: { msg: unknown; origin: string }
  }
}

describe('giscus utils', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('posts message to iframe contentWindow when iframe present', () => {
    const iframe = document.createElement('iframe')
    iframe.className = 'giscus-frame'
    const fakeWindow: { postMessage: (msg: unknown, origin: string) => void } = {
      postMessage: (msg, origin) => { window.__last = { msg, origin } }
    }
    Object.defineProperty(iframe, 'contentWindow', { value: fakeWindow, configurable: true })
    document.body.appendChild(iframe)

    sendMessage({ setConfig: { theme: 'dark' } })

    const last = window.__last!
    expect(last).toBeDefined()
    expect(last.msg).toEqual({ giscus: { setConfig: { theme: 'dark' } } })
    expect(last.origin).toBe('https://giscus.app')
  })

  it('does not throw when iframe missing', () => {
    expect(() => sendMessage({ setConfig: { theme: 'light' } })).not.toThrow()
  })
})
