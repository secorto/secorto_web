## Migration

## 0.0.1 -> 0.0.2

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
