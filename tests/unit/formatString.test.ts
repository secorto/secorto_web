import { describe, it, expect } from 'vitest'
import { formatString } from '@utils/formatString'

describe('formatString', () => {
  it('replaces a single placeholder', () => {
    expect(formatString('Hello {0}', ['world'])).toBe('Hello world')
  })

  it('replaces multiple and repeated placeholders', () => {
    const tpl = '{0} - {1} - {0}'
    expect(formatString(tpl, ['a', 'b'])).toBe('a - b - a')
  })

  it('casts number and boolean parameters to string', () => {
    expect(formatString('{0}|{1}', [42, true])).toBe('42|true')
  })

  it('throws TypeError when a parameter is missing', () => {
    expect(() => formatString('{0} {1}', ['only'])).toThrow(TypeError)
  })
})
