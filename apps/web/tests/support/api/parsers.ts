import type { APIResponse } from '@playwright/test'
import { XMLParser } from 'fast-xml-parser'
import type { ZodType } from 'zod'

export const validateContentType = (contentType: string, allowed: string[] = ['text/plain']) => {
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

export const xml = <T>(schema: ZodType<T>) =>
  async (response: APIResponse) => {
    const raw = await content(['application/xml', 'text/xml'])(response)

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '',
    })
    const parsed = parser.parse(raw)

    return schema.parse(parsed)
  }
