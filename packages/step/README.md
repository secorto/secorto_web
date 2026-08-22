# @secorto/step

Composable actions and verifications for test automation.

`@secorto/step` provides two small primitives:

- `step()` for observable actions (Arrange / Act)
- `verifyStep()` for observable verifications (Assert)

Together they produce readable tests, reusable behaviours and meaningful reports.

```ts
const home = await userInHome(page)

await home.shouldBeLoaded()
await home.shouldBeLoaded().soft()
```

---

## Why?

Most test suites eventually become collections of selectors and assertions:

```ts
await page.goto('/')

await expect(page.getByRole('heading')).toBeVisible()
await expect(page.locator('footer')).toBeVisible()
```

The test explains **how** verification happens.

With `@secorto/step`:

```ts
const home = await userInHome(page)

await home.shouldBeLoaded()
```

The test explains **what** is being verified.

Implementation details stay encapsulated.

---

## Quick Start

```ts
import { test, expect } from '@playwright/test'
import { createTestingStep } from '@secorto/step'

export const { step, verifyStep } = createTestingStep(
  test.step,
  expect,
  expect.soft,
)
```

---

## Actions with `step()`

Actions model Arrange and Act phases.

```ts
export const userInHome = (page: Page) =>
  step('user in homepage', async () => {
    await page.goto('/')
    return homePage(page)
  })
```

Usage:

```ts
const home = await userInHome(page)
```

The action becomes visible in reports and can return domain objects.

---

## Verifications with `verifyStep()`

Verifications model Assert.

```ts
shouldBeLoaded() {
  return verifyStep(
    'home is loaded',
    async ({ expect }) => {
      await expect(this.header).toBeVisible()
      await expect(this.footer).toBeVisible()
    },
  )
}
```

Execute normally:

```ts
await home.shouldBeLoaded()
```

Or using soft assertions:

```ts
await home.shouldBeLoaded().soft()
```

---

## Example

```ts
test('loads correctly', async ({ page }) => {
  const home = await userInHome(page)

  await home.shouldBeLoaded().soft()
  await home.shouldBeLoaded()
})
```

Resulting report:

```text
user in homepage
└─ Navigate to '/'

home is loaded (soft)
├─ Expect soft toBeVisible header
└─ Expect soft toBeVisible footer

home is loaded
├─ Expect toBeVisible header
└─ Expect toBeVisible footer
```

---

## Design Philosophy

`@secorto/step` is intentionally small.

It is not a testing framework.

It is not a DSL.

It is a library for building:

- Observable actions
- Reusable verifications
- Composable behaviours
- Framework-agnostic adapters

---

## Advanced: Custom Assertion Providers

Soft assertions are a convenience API.

The underlying model allows the assertion provider to be selected at execution time.

```ts
await home.shouldBeLoaded().with(expect)
```

```ts
await home.shouldBeLoaded().with(expect.soft)
```

```ts
await home.shouldBeLoaded().with(customExpect)
```

This enables verification composition while keeping execution strategies configurable.

---

## API

### createTestingStep

```ts
const { step, verifyStep } = createTestingStep(
  runner,
  expect,
  expect.soft,
)
```

Creates a project adapter.

### step

```ts
await step('open checkout', async () => {
  await page.goto('/checkout')
})
```

Observable action.

### verifyStep

```ts
await verifyStep(
  'checkout is loaded',
  async ({ expect }) => {
    await expect(title).toBeVisible()
  },
)
```

Observable verification.

---

## Architecture

Internally, verifications follow a compositional model.

Small verifications can be combined into larger ones:

```ts
await avatar.shouldBeVisible().with(expect)
await bio.shouldBeVisible().with(expect)
await cards.shouldBeValid().with(expect)
```

Page-level verifications can then be composed into application-level verifications.

The core abstraction is a reusable verification that remains independent from the assertion strategy used to execute it.

---

## License

MIT
