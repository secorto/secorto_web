import type { APIResponse } from '@playwright/test'

export const validateContentType = (contentType: string | null | undefined, allowed: string[] = ['text/plain']) => {
  if (!contentType) {
    throw new TypeError(`Missing content-type header`)
  }

  const isAllowed = allowed.some(type => contentType.includes(type))
  if (!isAllowed) {
    throw new Error(`Expected one of [${allowed.join(', ')}], got ${contentType}`)
  }
}

export const content = (allowed: string[]) =>
  async (response: APIResponse) => {
    if (!response.ok()) {
      throw new Error(`Expected successful response, got ${response.status()}`)
    }
    const contentType = response.headers()['content-type']
    validateContentType(contentType, allowed)

    return response.text()
  }

export const text = content(['text/plain'])
