# @secorto/ui-components

Test UI components library for Playwright-based E2E testing. Provides reusable, injectable Page Object helpers.

## Features

- **Target**: Base class for UI element interactions and verifications
- **Image**: Specialized Target for image loading verifications
- **Link**: Specialized Target for link href and navigation patterns
- **TargetSelector**: Generic selector for dynamic element queries with type-safe specializations
- **PageHelper**: Page-level helpers (URL, title verifications)
- **Dependency Injection**: All components receive `step` and `verifyStep` via factory, not global imports

## Installation

```bash
pnpm add @secorto/ui-components
```

## Usage

### Setup (once per project)

```typescript
// tests/step/ui.ts
import { createUIComponents } from '@secorto/ui-components'
import { step, verifyStep } from './index'  // Your local config

export const { target, image, link, pageHelper, targetSelector } = createUIComponents(step, verifyStep)
```

### In Page Objects

```typescript
import { target, image } from '@tests/step/ui'

export class HomePage {
  readonly title = target('page title', page.locator('h1'))
  readonly avatar = image('avatar', page.locator('img.avatar'))

  async shouldBeLoaded() {
    await this.title.shouldBeVisible()
    await this.avatar.shouldBeLoaded()
  }
}
```

### In Tests

```typescript
import { test } from '@playwright/test'
import { HomePage } from './pages/HomePage'

test('home page loads', async ({ page }) => {
  await page.goto('/')
  const home = new HomePage(page)
  await home.shouldBeLoaded()
})
```

## Components

### Target

Base class for any UI element.

```typescript
shouldBeVisible()
shouldHaveText(textOrRegex)
shouldContainText(textOrRegex)
shouldHaveVisibleText(textOrRegex)
shouldHaveClass(regex)
shouldHaveAttribute(name, value)
shouldHaveCount(count)
shouldHaveAtLeastOne()
click()
getAttribute(name) // async, for reading data
```

### Image

Extends Target. Waits for image to be fully loaded.

```typescript
shouldBeLoaded()  // Checks visibility + naturalWidth > 0
```

### Link

Extends Target. Link-specific verifications.

```typescript
hrefMatches(locale, route)        // Pattern match href
linksMatchPattern(pattern: RegExp) // All links match pattern
```

### TargetSelector

Generic selector for dynamic queries. Useful for lists and collections.

```typescript
const cardSelector = targetSelector(
  'cards',
  (title) => page.locator(`[data-title="${title}"]`),
  (title) => title
)

const card = cardSelector.get('My Card')
await card.shouldBeVisible()
```

### PageHelper

Page-level verifications.

```typescript
shouldHaveURL(expected)
shouldHaveTitle(expected)
```

## Architecture

- **Agnóstic to test runner**: Uses `@secorto/step` factory pattern
- **Agnóstic to project**: Each project configures `createUIComponents` once
- **Type-safe**: Full TypeScript support for specializations
- **Composable**: Create hierarchies via inheritance (Image, Link extend Target)

## License

See LICENSE in repository root.
