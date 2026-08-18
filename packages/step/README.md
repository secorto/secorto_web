# @secorto/step

Framework-agnostic building blocks for named test steps with injectable context.

## Overview

This package provides two primitives:

- **`makeStep(runner)`** — creates action steps (plain execution, no context)
- **`makeVerification(runner, context)`** — creates contextable steps that receive an injectable context (e.g. an `expect` function)

Both are completely decoupled from any test framework. You wire them up to your framework of choice by providing a `StepRunner`.

## Installation

```sh
npm install @secorto/step
```

## Usage

### With Playwright

```ts
import { test, expect } from '@playwright/test'
import { makeStep, makeVerification } from '@secorto/step'

// Action step — no context needed
export const step = makeStep(test.step)

// Verification step — injects { expect } into the action
export const verifyStep = makeVerification(test.step, { expect })

// Playwright-specific sugar for soft assertions
export const softVerifyStep = (title, action) =>
  verifyStep(title, action).with({ expect: expect.soft })
```

### In tests

```ts
// Action step
await step('fill the form', async () => {
  await page.fill('#name', 'Alice')
})

// Verification step
await verifyStep('page title is correct', ({ expect }) => {
  expect(page.title()).toBe('Home')
})

// Override context for soft assertions
await verifyStep('all fields are visible', ({ expect }) => {
  expect(page.locator('#name')).toBeVisible()
  expect(page.locator('#email')).toBeVisible()
}).with({ expect: expect.soft })
```

## API

### `StepRunner`

```ts
type StepRunner = (title: string, action: () => unknown) => Promise<unknown>
```

A function that executes a named step. Matches the signature of `test.step` in Playwright.

### `makeStep(runner)`

```ts
const makeStep: (runner: StepRunner) => <T>(title: string, action: () => T | Promise<T>) => Step<T>
```

Creates a step builder. The returned `step` function produces a `Step<T>` — a `Promise<T>` with `kind: 'action'`.

### `makeVerification(runner, context)`

```ts
const makeVerification: <TContext>(runner: StepRunner, context: TContext) =>
  <T>(title: string, action: (context: TContext) => T | Promise<T>) => ContextableStep<T, TContext>
```

Creates a verification step builder. The returned `verifyStep` function produces a `ContextableStep<T, TContext>` — a `Promise<T>` with `kind: 'verification'` and a `.with(partialContext)` method.

### `ContextableStep<T, TContext>`

```ts
interface ContextableStep<T, TContext> extends Promise<T> {
  kind: 'verification'
  with(context: Partial<TContext>): ContextableStep<T, TContext>
}
```

`.with(context)` returns a new `ContextableStep` with the context merged (shallow). Use it to override specific context values (e.g. swap `expect` for `expect.soft`).

## License

MIT
