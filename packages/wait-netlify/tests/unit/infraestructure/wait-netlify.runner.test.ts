import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fileURLToPath } from 'url'

const RUNNER_PATH = fileURLToPath(new URL('../../../src/wait-netlify-runner.js', import.meta.url))

// Ensure the mock factory used by `vi.mock` (which is hoisted) can reference
// a stable spy implementation. Declaring at module top prevents TDZ.
const runMock = vi.fn()
vi.mock('../../../src/wait-netlify.js', () => ({ runAndExit: runMock }))

describe('wait-netlify runner', () => {
  const OLD_ARGV = [...process.argv]
  beforeEach(() => {
    vi.resetModules()
    process.argv = [...OLD_ARGV]
    runMock.mockReset()
  })
  afterEach(() => {
    process.argv = [...OLD_ARGV]
    vi.restoreAllMocks()
  })

  it('calls runAndExit when module is executed directly', async () => {
    process.argv[1] = RUNNER_PATH
    await import('@secorto/wait-netlify/wait-netlify-runner')
    expect(runMock).toHaveBeenCalled()
  })

  it('does not call runAndExit when not executed directly', async () => {
    process.argv[1] = '/some/other/path'
    await import('@secorto/wait-netlify/wait-netlify-runner')
    expect(runMock).not.toHaveBeenCalled()
  })
})
