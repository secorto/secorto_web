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
- No usar bloques `try/catch` vacíos; siempre manejar o registrar la excepción,
  o justificar temporalmente con el patrón de deuda técnica:
  `// TODO(debt): <razón breve> — owner: @usuario — until: YYYY-MM-DD`

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
- Minimum frontmatter to avoid build errors: `title`, `date`, `tags`, `excerpt`.
- Use `draft: true` to mark drafts — the build/UI considers `draft` the source of truth for draft state.
- For translation workflows, prefer using a canonical `postId` in frontmatter to link translations to their original post when it is necessary to disambiguate slugs. The `postId` value, when present, should be the filename without `.md` (including date prefix if applicable). Ejemplo:

```yaml
postId: '2025-12-25-por-que-uso-npm'
```

- For re-publications (completely rewritten content): create a new file with the current date and add a 301 redirect from the old URL to the new slug (edit `netlify.toml`).
- Copilot: when generating or refactoring content with assistance, ensure the output includes complete frontmatter and that the suggested filename respects the date prefix. Do not accept suggestions for posts without a date-prefixed filename.
- **Types (strict)**: Copilot must never introduce the TypeScript `any` type in generated code. The project enforces `@typescript-eslint/no-explicit-any` as `error` in ESLint. If Copilot proposes `any`, reject the suggestion and prefer one of the following:
  - a concrete interface/type declaration, or
  - a generic type parameter (e.g., `T`) with a TODO comment linking to an issue for narrowing the type later, or
  - a small union or unknown-to-typed conversion with an explicit cast and a documented justification.

  Never use `as any` or broad `any` aliases. If an exceptional case genuinely cannot be typed (extraordinary legacy interop), create a short issue in the repo tracking the exception and reference it in the code comment.

- **`@ts-ignore` and variant comments**: `@ts-ignore`, `// @ts-expect-error`, `// @ts-nocheck` are highly restricted. Prefer fixing types instead of silencing the checker. If an ignore is unavoidable:
- use `// @ts-expect-error` only with a one-line description of why and a link to an issue (minimum 10 characters), and
- avoid `// @ts-ignore`; if used, it must be converted to an issue and justified in the comment as above.

- **Triple-slash references**: triple-slash references are allowed in `.d.ts` declaration files where necessary (for example to consume generated `.astro` types). Prefer adding an ESLint override for `*.d.ts` instead of inline disables.

- Default site language: Spanish (`es`). When the language is not explicitly specified, prefer Spanish for authoring content and suggested slugs. Contributors should prefer `postId` to associate translations only when slugs/ids differ; otherwise no manual mapping is required.

---

*Nota:* se ha reforzado la política de tipos: `any` está prohibido en el código de `src/` y ESLint lo marca como `error`. Para excepciones temporales en tests o carpetas legacy, documentar el caso y abrir un issue que lo rastree.

## Política de excepciones y technical debt (acuerdo)

Crear un issue en GitHub cuando sea útil para seguimiento; en el código, referenciar el issue en el TODO para vincular la excepción al seguimiento correspondiente. Ejemplo breve:

```ts
// TODO(debt): <razón breve> — issue: #123
```

Reglas rápidas:

- El comentario debe aparecer inmediatamente arriba de la línea o bloque afectado.
- `issue` debe referenciar el número de issue donde se hará el seguimiento.

Si conviene agrupar varias excepciones relacionadas en un solo issue, hágalo; deje que el mantenedor decida la granularidad. Mantenga la documentación en issues en lugar de archivos MD en el repo para simplificar la gestión.

---

*These instructions are for GitHub Copilot and contributors to ensure code consistency and quality in the secorto_web project.*
