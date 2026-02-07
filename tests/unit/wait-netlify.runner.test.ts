import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fileURLToPath } from 'url'

const RUNNER_PATH = fileURLToPath(new URL('../../.github/scripts/wait-netlify-runner.js', import.meta.url))

// Ensure the mock factory used by `vi.mock` (which is hoisted) can reference
// a stable spy implementation. Declaring at module top prevents TDZ.
const runMock = vi.fn()

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
    // mock runAndExit before importing runner (use module-top `runMock`)
    vi.mock('../../.github/scripts/wait-netlify.js', () => ({ runAndExit: runMock }))
    process.argv[1] = RUNNER_PATH
    await import('../../.github/scripts/wait-netlify-runner.js')
    expect(runMock).toHaveBeenCalled()
  })

  it('does not call runAndExit when not executed directly', async () => {
    vi.mock('../../.github/scripts/wait-netlify.js', () => ({ runAndExit: runMock }))
    process.argv[1] = '/some/other/path'
    await import('../../.github/scripts/wait-netlify-runner.js')
    expect(runMock).not.toHaveBeenCalled()
  })
})
