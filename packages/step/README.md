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

export const { step, verifyStep } = createTestingStep(
  test.step,
  expect,
  expect.soft
)

// Define Verification<T> to align with Step<T>
export type Verification<T> =
  GenericVerification<T, typeof expect | typeof expect.soft>

export type { Step } from '@secorto/step'
```

### Why the caller must define `Verification<T>`

`@secorto/step` exposes the generic verification primitive `GenericVerification<T, E>`
but it does not decide which assertion engine E should be.

- `step` and `verifyStep` share the same semantic contract
- the correct assertion engine (`expect` or `expect.soft`) is injected into each verification
- `.with()` and `.soft()` remain fully type‑safe
- the verification result aligns with the project’s flow layer
- the library stays transversal and framework‑agnostic

### This keeps the integration explicit

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

### `createStep(runner, symbol)`

```ts
const step = createStep(runner, 'CheckoutStep')

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

### `createVerifyStep(defaultExpect, softExpect, buildStep)`

```ts
const verifyStep = createVerifyStep(
  expect,
  expect.soft,
  createContextStep(runner, 'VerifyStep')
)

await verifyStep('check the value', ({ expect }) => {
  expect(true).toBe(true)
})
```

This is the explicit factory form for the common verification adapter.
It receives the default and soft assertion implementations plus a step builder,
and returns a verification step factory that preserves the same semantics as `createTestingStep`.

### `createTestingStep`

```ts
const { step, verifyStep, contractStep } = createTestingStep(runner, expect, expect.soft)
```

This helper builds the same verification factory internally by composing
`createStep` and `createVerifyStep` with `createContextStep`, and also includes a contract step factory.

### `createContractStep(runner, symbol)`

```ts
const contractStep = createContractStep(runner, 'ContractStepAction')

await contractStep('fetch and parse response', async () => fetchJSON(), (json) => parse(json))
```

Creates a contract step that manages two functions:
- **originFn**: The source of truth (e.g., fetch raw data)
- **transformFn**: Parser or validator (e.g., parse JSON, verify schema)

#### Default behavior (chained execution)

By default, awaiting the contract step executes both functions in sequence:
originFn runs first, then its result is passed to transformFn.
The promise resolves with the transformFn result.

```ts
const parsed = await contractStep(
  'fetch user from API',
  async () => fetchUserJSON(),
  (json) => JSON.parse(json) as User
)
// parsed is of type User
```

#### `.raw()` method

Executes only originFn and resolves with its result, skipping transformFn entirely.
Useful to verify the raw data before transformation.

```ts
const rawResponse = await contractStep(
  'fetch user from API',
  async () => fetchUserJSON(),
  (json) => JSON.parse(json) as User
).raw()
// rawResponse is the raw JSON string
```

#### `.detailed()` method

Executes both functions and resolves with an object containing both results.
Useful for comprehensive validation or when you need to compare raw vs. parsed data.

```ts
const { parsed, raw } = await contractStep(
  'fetch user from API',
  async () => fetchUserJSON(),
  (json) => JSON.parse(json) as User
).detailed()
// parsed: User
// raw: JSON string
```

#### Metadata inspection

Like other step primitives, contract steps preserve metadata for inspection
before execution:

```ts
const myContract = contractStep(
  'fetch and parse',
  async () => fetchUserJSON(),
  (json) => JSON.parse(json)
)

console.log(myContract.title)      // 'fetch and parse'
console.log(myContract.originFn)   // [Function]
console.log(myContract.transformFn) // [Function]
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

In 0.0.1, types were exported from `@secorto/step/playwright`:

```ts
export type { Step, Verification } from '@secorto/step/playwright'
```

In the current version, `Step` is exported from `@secorto/step`, and
`Verification<T>` must be defined by the caller using GenericVerification.

## License

MIT
