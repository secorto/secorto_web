# @secorto/step

Framework-agnostic step primitives with a Playwright adapter.

## Overview

This package provides a minimal core primitive and a Playwright-specific layer:

- `makeStep(runner)` creates action steps
- `@secorto/step/playwright` exports `step` and `verifyStep`
- `verifyStep` can be overridden with `expect` or `expect.soft`
- `.soft()` rewrites the title to `${title} (soft)`

The goal is to keep the core generic and keep the Playwright-specific behavior in the adapter boundary.

## Installation

```sh
npm install @secorto/step
```

## Core API

### `StepRunner`

```ts
export type StepRunner = (
  title: string,
  action: () => unknown
) => Promise<unknown>
```

A runner is any function compatible with Playwright’s `test.step` signature.

### `makeStep(runner)`

```ts
const makeStep = (runner: StepRunner) =>
  <T>(title: string, action: () => T | Promise<T>): Step<T>
```

Returns a `Step<T>` object, which is a `Promise<T>` with `title` and `action` metadata.

```ts
import { makeStep } from '@secorto/step'

const step = makeStep(async (title, action) => {
  return action()
})

await step('fill the form', async () => {
  return 'done'
})
```

## Playwright adapter

Use the adapter export for Playwright-specific behavior:

```ts
import { expect, test } from '@playwright/test'
import { step, verifyStep } from '@secorto/step/playwright'
```

### `step`

A Playwright-backed step runner created from `test.step`.

```ts
await step('open the page', async () => {
  await page.goto('/home')
})
```

### `verifyStep`

```ts
await verifyStep('page title is correct', ({ expect }) => {
  expect(await page.title()).toBe('Home')
})
```

The callback receives a context object with an `expect` provider.

### `.with(...)`

You can override the expect provider.

```ts
await verifyStep('title should be visible', ({ expect }) => {
  expect('Home').toBe('Home')
}).with(expect)

await verifyStep('title should be visible softly', ({ expect }) => {
  expect('Home').toBe('Home')
}).with(expect.soft)
```

### `.soft()`

`soft()` is a convenience wrapper that keeps the same action but uses `expect.soft` and rewrites the title:

```ts
const result = verifyStep('checkout total', ({ expect }) => {
  expect(42).toBe(42)
  return 'ok'
}).soft()

// title becomes: "checkout total (soft)"
```

The adapter exposes the current title in the returned step object:

```ts
console.log(result.title)
// "checkout total (soft)"
```

## Type surface

```ts
export type ExpectAdapter = typeof expect | typeof expect.soft

export type VerifyContext = { expect: ExpectAdapter }
```

The adapter intentionally keeps the type aligned with the real Playwright API variants, without pretending `expect.soft` is identical to the full `expect` object.

## License

MIT
