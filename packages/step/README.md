# @secorto/step | Test Automation with Real Cohesion

## Purpose: Why this library exists

**The missing bridge between user stories and code execution.**

Most test automation suites suffer from a critical architectural flaw: **the disconnection between business intent and technical implementation**.

Whether you use traditional *Page Objects* or complex abstraction layers, the human-readable description of a step
and the technical code that runs it usually live in completely different places.
This separation forces developers to constantly jump between contexts, breeds massive maintenance overhead,
and turns test suites into brittle nightmares that are a pain to refactor.

`@secorto/step` fixes this by bringing back **cohesion**. It is intentionally tiny, framework-agnostic,
and designed to make your automation suites stop squeaking.

## How it works: The 4 Core Primitives

`@secorto/step` provides four self-contained building blocks to ensure your code structure matches
your reporting structure perfectly.

### 1. `step()` (Cohesive Actions)

Binds a business action name directly to its functional code block. Perfect for packaging browser interactions
and returning clean domain objects.

```ts
export const userInHome = (page: Page, locale: UILanguages) =>
  step(`user opens homepage in ${locale}`, async () => {
    await page.goto(`/${locale}/`)
    return homePage(page)
  })
```

### 2. `verifyStep()` (Cohesive Verifications)

Encapsulates a visual or UI assertion alongside its human-readable description.

```ts
shouldBeInLocale(locale: UILanguages) {
  return verifyStep('url matches locale pattern', async ({ expect }) => {
    await expect(page).toHaveURL(new RegExp(`/${locale}(/|$)`))
  })
}
```

### 3. `contractStep()` (Cohesive Data Transformers)

Pure asynchronous data fetching and parsing. It transforms raw network payloads into clean domain objects
using your preferred schema utility (Zod, ArkType) before they reach the UI.

```ts
export const fetchUser = (id: string) =>
  contractStep(
    'fetch and parse user data',
    async () => await api.getUser(id),
    (json) => userSchema.parse(json)
  )
```

### 4. `contractVerifyStep()` (Cohesive Verification & Transformation Streams) 🌟

The ultimate tool for end-to-end integration. It bridges a data contract with a verification block.
It handles asynchronous data fetching,
passes the raw payload directly into an assertion block that has full access to the active execution context (`expect`),
and simultaneously returns the transformed data.

```ts
export const syncAndVerifyUser = (id: string) =>
  contractVerifyStep(
    'fetch user and verify profile layout',
    async () => await api.getUser(id),
    async (raw, { expect }) => {
      await expect(page.locator('#email')).hasText(raw.email)
      return { id: raw.id, email: raw.email }
    }
  )
```

## The Paradigm Shift: Real Cohesion Across All Layers

At this point, traditional testing purists might blink. For years,the industry dogmatized
that business intent and technical implementation must be strictly separated
into isolated helper files or heavy global adapters.

But that artificial separation comes with a hidden tax: it destroys focus and creates brittle structures.

`@secorto/step` brings back **Real Cohesion**. It is designed under a radical premise:
**semantic steps shouldn't live trapped inside a single adapter file;**
**they should naturally permeate every single layer of your test architecture.**

Whether it is an atomic UI component validating its own state, a data client enforcing an API schema,
or a high-level page object orchestrating a complex user flow—description and execution live together where they belong,
as a single, unbreakable unit across your entire repository.

## Fractal Composition & Strategy Control: The Power of `.with()`

Because `@secorto/step` primitives are completely *lazy* and driven by Dependency Injection (DI),
your verification blocks enable a **fractal design pattern**.

Instead of building massive, unmaintainable *God Classes*, you can break your UI down into infinitely nested components.
High-level structures seamlessly forward the active execution engine down to individual subcomponents using `.with(expect)`.

### Unlocking Fractal Page Objects

A parent page component doesn't know (and shouldn't care) if a test case is evaluating assertions strictly
or via a soft strategy. By utilizing `.with(expect)`, the execution engine cascades down to the atomic level naturally:

```ts
export class HomePageMain {
  constructor(readonly avatar: TargetComponent, readonly bioText: TargetComponent) {}

  shouldBeLocalized(locale: UILanguages) {
    return verifyStep('homepage main is localized', async ({ expect }) => {
      // Deeply nesting and forwarding the runtime engine polimorphically
      await this.avatar.shouldBeVisible().with(expect)
      await this.bioText.shouldBeVisible().with(expect)
    })
  }
}

export class HomePage {
  constructor(readonly main: HomePageMain, readonly mainLayout: MainLayoutComponent) {}

  shouldBeLocalized(locale: UILanguages) {
    return verifyStep(`homepage is localized in ${locale}`, async ({ expect }) => {
      // Triggering nested components while maintaining the same strategy
      await this.shouldBeInLocale(locale).with(expect)
      await this.main.shouldBeLocalized(locale).with(expect)
      await this.mainLayout.shouldBeLocalized(locale).with(expect)
    })
  }
}
```

### Deferred Runtime Strategy Control

The execution strategy is decided **at the call site** of the test case,
while your complex fractal page definitions remain entirely agnostic:

```ts
const home = await userInHome(page, 'en')

// Standard / Hard Assertion: Halts the entire suite immediately if any nested element fails.
await home.shouldBeLocalized('en')

// Soft Assertion: Captures any deep nested failure softly inside the report, letting the test continue.
await home.shouldBeLocalized('en').soft()
```

## Advanced Execution Control

### `.raw()` — Bypassing Verification & Transformations

For specialized scenarios (like negative testing, testing error payload structures,
or using contracts in utility scripts), `.raw()` allows you to skip transformation and verification blocks entirely,
returning the raw payload directly from `contractStep` or `contractVerifyStep`:

```ts
// Bypasses assertions and transforms completely to inspect raw endpoint responses
const rawJson = await syncAndVerifyUser('123').raw()
const rawUserPayload = await fetchUser('123').raw()
```

## The Setup: Project Adapter

To unlock strong TypeScript auto-completion and bind @secorto/step to your specific test runner,
you need to create an adapter file within your project's test support or configuration folder
(for instance, under tests/step or your local setup directory).
This thin layer bridges the library's generic interfaces with your framework's concrete types (e.g., Playwright).

Create your custom step adapter file where it best fits your folder structure:

```ts
import { expect, test } from '@playwright/test'
import {
  createTestingStep,
  type GenericVerification,
  type GenericContractVerify
} from '@secorto/step'

// Bind your framework's concrete types for flawless IDE auto-completion
export type Verification<T> = GenericVerification<T, typeof expect | typeof expect.soft>
export type ContractVerification<TRaw, TTransform> =
  GenericContractVerification<TRaw, TTransform, typeof expect | typeof expect.soft>

// Export your project-scoped atomic factories
export const { step, verifyStep, contractStep, contractVerifyStep } = createTestingStep(
  test.step,
  expect,
  expect.soft
)

// Re-export core contracts
export type { Step, ContractStep } from '@secorto/step'
```
