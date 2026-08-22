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
const { step, verifyStep } = createTestingStep(runner, expect, expect.soft)
```

This helper builds the same verification factory internally by composing
`createStep` and `createVerifyStep` with `createContextStep`.
