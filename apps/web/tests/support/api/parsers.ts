import type { APIResponse } from '@playwright/test'

export const text = (allowed: string[] = ['text/plain']) =>
  async (response: APIResponse) => {
    if (!response.ok()) {
      throw new Error(`Expected successful response, got ${response.status()}`)
    }

    const contentType = response.headers()['content-type'] ?? ''

    // Accept any allowed text/* subtype
    const isAllowed = allowed.some(type => contentType.includes(type))
    if (!isAllowed) {
      throw new Error(
        `Expected one of [${allowed.join(', ')}], got ${contentType}`
      )
    }

    return response.text()
  }
