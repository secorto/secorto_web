import { describe, it, expect } from 'vitest'
import pkg from '../../../package.json' with { type: 'json' }

describe('wait-netlify package metadata', () => {
  it('exposes the public CLI binary name', () => {
    expect(pkg.bin).toMatchObject({
      'wait-netlify': './src/wait-netlify-runner.js'
    })
  })
})
