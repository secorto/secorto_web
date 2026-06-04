import { test } from '@playwright/test'

export const step = <T>(title: string, run: () => T | Promise<T>) =>
  test.step(title, run)
