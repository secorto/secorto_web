import type { APIResponse } from '@playwright/test'
import type { ZodType } from 'astro:schema'
import { XMLParser } from 'fast-xml-parser'
import { content } from './content'

export const xml = <T>(schema: ZodType<T>) =>
  async (response: APIResponse) => {
    const raw = await content(['application/xml', 'text/xml'])(response)

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '',
    });
    const parsed = parser.parse(raw);

    return schema.parse(parsed);
  }
