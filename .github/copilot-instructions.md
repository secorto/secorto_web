# GitHub Copilot Instructions for secorto_web

## Project Overview
- **Framework:** Astro
- **UI Enhancements:** astro-expressive-code
- **Testing:** Cypress (with cypress-axe for accessibility)
- **Language:** TypeScript (preferred)
- **Semicolons:** Omit semicolons (`;`) unless required by syntax or tooling
- **Types:** Avoid `any` type; always define custom types or interfaces

## Coding Guidelines
- Use TypeScript for all new code and refactors when possible
- Prefer explicit, custom types and interfaces over `any` or overly broad types
- Omit semicolons at the end of statements unless absolutely necessary
- Follow Astro and Cypress best practices for file structure and conventions
- Keep code modular and readable
- Use descriptive variable and function names
- Add comments for complex logic or non-obvious code

## Astro Specific
- Use `.astro` components for UI and layout
- Place shared components in `src/components/`
- Use `src/layouts/` for layout components
- Static assets go in `public/` or `src/assets/`
- Use `astro-expressive-code` for code block rendering and syntax highlighting

## Cypress Specific
- Place end-to-end tests in `cypress/e2e/`
- Use TypeScript for Cypress tests
- Prefer custom Cypress commands and types over using `any`
- Integrate `cypress-axe` for accessibility checks in tests
- Place Cypress support files in `cypress/support/`
- Use `cy.injectAxe()` and `cy.checkA11y()` in tests to ensure accessibility

## Playwright Specific

- Place end-to-end tests in `tests/e2e/` and helpers in `tests/e2e/helpers/`
- Use TypeScript for Playwright tests and helpers
- Mock third‑party scripts/resources (e.g. giscus) with `page.route()` to keep tests fast and deterministic
- Always register routes/mocks before the navigation or action that triggers the request to avoid race conditions
- Prefer asserting server-rendered attributes and widget visibility (`data-*`, `iframe.giscus-frame`) instead of inspecting cross-origin iframe internals
- Keep timeouts reasonable (e.g., 30s for slow widgets) and avoid flaky DOM polling in tests
- Use `npx playwright test` with `-g` or path filters for targeted runs

## Page Object Model (POM) Pattern — Tests/pages

- Store page objects in `tests/pages/` as classes (e.g., `ContentListPage`)
- Page object conventions:
  - Constructor signature: `constructor(page: Page)`
  - Provide locator getters (nouns) and action methods (verbs)
  - Do not include assertions inside page objects — keep assertions in tests
  - Avoid heavy waits inside page objects; expose stable locators and let tests decide explicit waits when needed
  - Export types for complex interactions where helpful
- Helpers and mocks:
  - Centralize reusable mocks in `tests/e2e/helpers/` (e.g., `mockGiscus.ts`)
  - Keep mock implementations small and deterministic (inject a simple iframe or stubbed script)
- Examples:
  - See `tests/pages/ContentListPage.ts` for a POM example
  - Put shared test utilities in `tests/utils/` or `tests/e2e/helpers/`

## Testing Guidance (practical tradeoffs)

- For i18n changes: prefer unit tests + small server‑side snapshots; add an e2e (mocked) smoke test only for critical UX flows
- Avoid asserting third‑party widget internal text in CI; instead validate the props/attributes passed and that the widget mounted
- Prefer deterministic tests: mock network, isolate external dependencies, and keep e2e suite as a small smoke surface

## General
- Keep dependencies up to date
- Write clear, concise commit messages
- Document new features and changes in `README.md` as needed
 - Add unit tests for new utility functions. Prefer TypeScript tests and
   keep them alongside the code (`tests/unit/` or appropriate test folder).
   For small CI helper scripts or other utilities that must remain plain
   JavaScript (for example when `ts-node` is problematic in CI), include
   a `// @ts-check` comment at the top and use JSDoc type annotations so
   editor/type-checking feedback is preserved without requiring a TypeScript
   runtime. This helps maintain type-safety and makes such files easier to
   test and review.

## Publication & i18n conventions

- Post filename: always use `YYYY-MM-DD-slug.md` for new or republished posts. This applies to `src/content/<collection>/<locale>/`.
- Minimum frontmatter to avoid build errors: `title`, `date`, `tags`, `excerpt`, and `translation_status` (one of: `original`, `translated`, `draft`, `pending`, `partial`).
- If the file is a translation, include `translation_origin` with `{ locale: '<origin>', id: '<origin_id>' }`. The `id` must be the filename without `.md`, including the date prefix when applicable.
- For re-publications (completely rewritten content): create a new file with the current date and add a 301 redirect from the old URL to the new slug (edit `netlify.toml`).
- Before committing new posts or mass changes: run the helper scripts in `/scripts`:
	- `node ./scripts/list-missing-translation-status.js`
	- `node ./scripts/auto-mark-translated.js`
	- `node ./scripts/check-translation-inconsistencies.js`

- Copilot: when generating or refactoring content with assistance, ensure the output includes complete frontmatter and that the suggested filename respects the date prefix. Do not accept suggestions for posts without a date-prefixed filename.

- Default site language: Spanish (`es`). When the language is not explicitly specified, prefer Spanish for authoring content and suggested slugs. Contributors should still provide translations and set `translation_status` appropriately.

---

*These instructions are for GitHub Copilot and contributors to ensure code consistency and quality in the secorto_web project.*
