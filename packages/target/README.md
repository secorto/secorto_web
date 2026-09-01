# @secorto/target

A minimalist, typesafe, and immutable structural composition utility designed to enhance base objects with
dynamic capabilities using a fluent **Actors & Abilities** mental model.

## The Story: The Trap of Growing Objects

Every automation project, UI component layer, or testing suite starts small and beautiful. You begin with
simple objects or Page Objects to interact with your system. They represent elements, layouts, or users.

Then, reality hits. Requirements grow. You face a hard architectural choice:

1. **The Inheritance Trap:** You create complex class hierarchies (`BasePage` -> `AuthenticatedPage`) that
   become brittle, rigid, and impossible to untangle.
2. **The God-Object Trap:** You stuff every single method, step, and locator into a single massive file. Your
   simple abstraction becomes a multi-thousand-line black hole that is terrifying to modify.

We needed a way to build multi-layered architectures that feel like writing a screenplay—where a **Target is a
named element** (`name`, `element`), you give them **Abilities**, and they execute actions cleanly, without losing
strict TypeScript autocompletion or risking shared-mutable state side effects.

That is why `@secorto/target` was born.

---

## What It Solves

`@secorto/target` replaces heavy classes and monolithic structures with **functional, polymorphic composition**.
It breaks your code into tiny, independent, reusable functions and merges them back together on demand.

* **Decouples State from Behavior:** Your base subjects (`Targets`) remain thin data snapshots holding their
  identity and core engines, while their capabilities (`Abilities`) live as isolated, highly testable functions.
* **Eliminates `any` Boilerplate:** It uses advanced type-level mechanics (`UnionToIntersection`) to automatically
  infer and flatten your combined methods into a single, perfectly typed interface. No manual casting required.
* **Enforces Absolute Runtime Safety:** Every single target created is automatically frozen deep at the root
  level using `Object.freeze`. Capabilities cannot be mutated at runtime, wiping out side-effect bugs.

---

## How It Works

The entire API relies on a minimal, highly expressive two-word vocabulary: **`createTarget`** and **`withAbilities`**.

### 1. Declare Isolated Abilities

Instead of writing big classes, you write small, standalone functions. Every capability follows a predictable
signature layout: `(target, dependency) => (...args) => result`.

By forcing the reporting `dependency` to be mandatory, you completely remove conditional boilerplate (`if`) while
guaranteeing full reporting compliance across your suite.

```typescript
import type { Locator } from '@playwright/test';
import type { Target } from '@secorto/target';

/**
 * A standard runner for test reporting steps.
 * For example, this matches `test.step` from `@playwright/test`
 * or the execution engine from `@secorto/step`.
 */
export type StepRunner = (title: string, body: () => Promise<unknown>) => Promise<unknown>;

// browserAbilities.ts
/**
 * Clicks the target element and automatically wraps the action inside a reporting step.
 *
 * @param target - The named element containing the Playwright Locator.
 * @param step - The mandatory reporting runner (e.g., from `@secorto/step` or `test.step`).
 */
export const click = (target: Target<Locator>, step: StepRunner) =>
  async () => {
    await step(`Click on "${target.name}"`, async () => {
      await target.element.click();
    });
  };

/**
 * Fills the target element with text and automatically wraps the action inside a reporting step.
 *
 * @param target - The named element containing the Playwright Locator.
 * @param step - The mandatory reporting runner (e.g., from `@secorto/step` or `test.step`).
 */
export const fill = (target: Target<Locator>, step: StepRunner) =>
  async (text: string) => {
    await step(`Fill "${target.name}" with: ${text}`, async () => {
      await target.element.fill(text);
    });
  };
```

### 2. Assemble Your Actor

When you are ready to use them, import your behaviors and bind them to your named element using `createTarget`.
Since you are exporting modular functions, you can take advantage of native JavaScript shorthand properties.

```typescript
// actors.ts
import { test } from '@playwright/test';
import { createTarget, withAbilities } from '@secorto/target';
import { click, fill } from './browserAbilities';

const usernameLocator = page.locator('#username');
const submitLocator = page.locator('input[type="submit"]');

// The reporting tool is injected at construction. If omitted, TS will fail to compile.
export const usernameInput = createTarget(
  'Username Field',
  usernameLocator,
  withAbilities({ fill }, test.step)
);

export const loginButton = createTarget(
  'Submit Login Button',
  submitLocator,
  withAbilities({ click }, test.step)
);
```

### 3. Execute Clean Business Logic

Your final target behaves exactly like a native object, seamlessly delegating actions to its underlying engine.
Every action executed will automatically build a human-readable HTML reporting tree without boilerplate.

```typescript
// login.spec.ts
import { test } from '@playwright/test';
import { usernameInput, loginButton } from './actors';

test('should authenticate a user smoothly', async () => {
  // Clean, functional, immutable, and fully typesafe!
  await usernameInput.fill('sergio@secorto.com');
  await loginButton.click();
});
```

---

## Core API Reference

### `Target<T>`

An exported explicit type interface representing your named subjects.

* **`name`**: `string` identifier used for logging and documentation.
* **`element`**: The generic underlying execution engine (`T`).

### `withAbilities(abilities, dependency?)`

Takes an object map of capabilities and injects the context dependency lazily.

* Abilities automatically receive `(target, dependency)` upon execution.
* Ideal for forcing architectural contracts (like mandatory reporters or database drivers).

### `createTarget(name, element, ...abilities)`

Constructs, materializes, and seals your composite structure.

* **`name`**: `string` identifier used for human-readable reporting.
* **`element`**: The technical anchor point or interaction engine (e.g., a Playwright `Locator`).
* **`...abilities`**: A variadic sequence of `withAbilities` compositions.
* **Returns**: A deeply typed, **runtime-frozen (`Object.freeze`)** immutable object.
