# GitHub Copilot Instructions for secorto_web

## Project Overview
- **Framework:** Astro
- **Testing:** Cypress
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

## Cypress Specific
- Place end-to-end tests in `cypress/e2e/`
- Use TypeScript for Cypress tests
- Prefer custom Cypress commands and types over using `any`

## General
- Keep dependencies up to date
- Write clear, concise commit messages
- Document new features and changes in `README.md` as needed

---

*These instructions are for GitHub Copilot and contributors to ensure code consistency and quality in the secorto_web project.*
