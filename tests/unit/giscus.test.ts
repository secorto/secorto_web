/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { sendMessage } from '@client/giscus'

describe('giscus utils', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('posts message to iframe contentWindow when iframe present', () => {
    const iframe = document.createElement('iframe')
    iframe.className = 'giscus-frame'
    const postMessage = vi.fn()
    Object.defineProperty(iframe, 'contentWindow', { value: { postMessage }, configurable: true })
    document.body.appendChild(iframe)

    sendMessage({ setConfig: { theme: 'dark' } })

    expect(postMessage).toHaveBeenCalledWith(
      { giscus: { setConfig: { theme: 'dark' } } },
      'https://giscus.app'
    )
  })

  it('does not throw when iframe missing', () => {
    expect(() => sendMessage({ setConfig: { theme: 'light' } })).not.toThrow()
  })
})
