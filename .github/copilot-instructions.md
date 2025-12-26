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

## General
- Keep dependencies up to date
- Write clear, concise commit messages
- Document new features and changes in `README.md` as needed

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
