/**
 * Helpers to remove/restore `globalThis.fetch` during tests without repeating
 * the type cast in every test file.
 */
export function deleteGlobalFetch(): typeof fetch | undefined {
  const g = globalThis as { fetch?: typeof fetch }
  const old = g.fetch
  try {
    // delete may fail in some strict environments; ignore errors
    delete (g as { fetch?: typeof fetch }).fetch
  } catch {
    ;(g as { fetch?: typeof fetch }).fetch = undefined
  }
  return old
}

export function restoreGlobalFetch(old?: typeof fetch) {
  const g = globalThis as { fetch?: typeof fetch }
  if (old === undefined) {
    try {
      delete (g as { fetch?: typeof fetch }).fetch
    } catch {
      ;(g as { fetch?: typeof fetch }).fetch = undefined
    }
  } else {
    g.fetch = old
  }
}

export async function withDeletedFetch<T>(fn: () => Promise<T> | T) {
  const old = deleteGlobalFetch()
  try {
    return await fn()
  } finally {
    restoreGlobalFetch(old)
  }
}
