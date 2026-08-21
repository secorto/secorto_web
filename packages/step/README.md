# @secorto/step

Small primitives for building the observable step layer used in secorto_web.
This package is intentionally minimal: it is not a global DSL,
but a tiny adapter that lets each feature define its own named steps and verifications
using any runner and any assertion engine.

## Purpose

In secorto_web, each test area defines its own adapter:

- a local runner (test.step or any equivalent)
- an assertion engine (expect, expect.soft)
- domain‑specific helpers (openHome, shouldShowMainContent, etc.)

`@secorto/step` provides the minimal building blocks to create those helpers without coupling the project
to Playwright or any specific framework.

## Real project pattern

```ts
import { expect, test } from '@playwright/test'
import { createTestingStep, type GenericVerification } from '@secorto/step'

export type Verification<T> =
  GenericVerification<T, typeof expect | typeof expect.soft>

export const { step, verifyStep } = createTestingStep(
  test.step,
  expect,
  expect.soft
)

export type { Step } from '@secorto/step'
```

This keeps the integration explicit:

- `test.step` is the current ergonomic runner
- `expect` / `expect.soft` are assertion providers
- domain helpers remain readable and intention‑driven
- the adapter can be replaced later without changing step semantics

## Typical usage

```ts
export const openHome = () =>
  step('abrir la home', async () => {
    await page.goto('/home')
  })

export const shouldShowMainContent = () =>
  verifyStep('la home muestra el contenido principal', ({ expect }) => {
    expect(page.getByRole('heading', { name: 'Secorto' })).toBeVisible()
  })
```

The code expresses business intent, while Playwright details stay encapsulated.

## API Surface

### `StepRunner`

```ts
export type StepRunner = <T>(
  title: string,
  action: () => T | Promise<T>
) => Promise<T>
```

A runner executes an action under a given title.
Framework‑agnostic by design.

### `makeStep(runner, symbol)`

```ts
const step = makeStep(runner, 'CheckoutStep')

await step('open checkout', async () => 'done')
```

Creates a step object that preserves title and action metadata.

### `createContextStep`

```ts
const withUser = createContextStep<{ userId: string }>(runner, 'UserStep')

await withUser('load profile', ({ userId }) => console.log(userId), {
  userId: 'u_123',
})
```

Useful when each step requires a fixed runtime context.

### `makeVerifyStep(runner, defaultExpect, softExpect)`

```ts
const verifyStep = makeVerifyStep(runner, expect, softExpect)

await verifyStep('check the value', ({ expect }) => {
  expect(true).toBe(true)
})
```

This is the explicit factory form for the common verification adapter.
It keeps the same semantics as `createTestingStep` but makes the verification intent clearer when you only need the `verifyStep` helper.

### `createTestingStep`

```ts
const { step, verifyStep } = createTestingStep(runner, expect, softExpect)
```

## Ergonomics `.with(...)` and `.soft()`

These are part of the verification ergonomics of the adapter:

```ts
await verifyStep('price is visible', ({ expect }) => {
  expect(page.getByText('$42.00')).toBeVisible()
}).with(expect)

await verifyStep('banner is shown', ({ expect }) => {
  expect(page.getByRole('alert')).toContainText('Saved')
}).with(expect.soft)
```

```ts
const result = verifyStep('total is stable', ({ expect }) => {
  expect(42).toBe(42)
  return 'ok'
}).soft()
```

These helpers allow switching the assertion engine per step or forcing soft mode.

## Migration note (from 0.0.1)

Version 0.0.1 exposed a Playwright‑first helper:

```ts
import { createPlaywrightStep } from '@secorto/step/playwright'

const { step, verifyStep } = createPlaywrightStep()
```

This has been replaced by the more explicit and generic form:

```ts
import { createTestingStep } from '@secorto/step'
import { expect, test } from '@playwright/test'

const { step, verifyStep } = createTestingStep(
  test.step,
  expect,
  expect.soft
)
```

## License

MIT
