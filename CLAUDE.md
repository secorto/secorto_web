# Instructions for Claude CLI

## Stack

- **Monorepo** managed with pnpm workspaces (`apps/web`, `packages/i18n`, `packages/step`, `packages/wait-netlify`)
- **Framework:** Astro 7 (TypeScript, SSG)
- **Tests:** Vitest (unit) + Playwright (E2E)
- **Linting:** ESLint + markdownlint-cli2
- **Node:** >=24 (see `.nvmrc`)
- **Style:** no semicolons except when necessary

## Key Commands (from root)

```bash
pnpm install              # install dependencies
pnpm run build            # type check + build (all workspaces)
pnpm run dev              # dev server (Astro in apps/web)
pnpm run lint             # ESLint + markdownlint
pnpm run test             # vitest --run
pnpm run test:unit        # unit tests (all workspaces)
pnpm run test:e2e         # Playwright E2E (apps/web)
pnpm run test:coverage    # vitest with coverage
```

## Core Principle: Quality by Design

Testing integrated at each layer. Three principles enable it:

1. **Separation of Concerns** — pure logic in `src/domain/`, presentation in Astro components
2. **DRY** — centralized configuration, single source of truth
3. **Type Safety** — TypeScript strict, no `any`, validation at build time

## Project Documentation

| Need | Document |
| --- | --- |
| Architectural principles | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) |
| Decisions (ADRs) | [docs/adr/README.md](docs/adr/README.md) |
| Coding guidelines | [docs/CODING_GUIDELINES.md](docs/CODING_GUIDELINES.md) |
| Testing strategy | [docs/architecture/TESTING_STRATEGY.md](docs/architecture/TESTING_STRATEGY.md) |
| E2E flows | [docs/architecture/FLOWS.md](docs/architecture/FLOWS.md) |
| AI policy | [docs/AI_POLICY.md](docs/AI_POLICY.md) |
| Common AI mistakes | [docs/COMMON_AI_MISTAKES.md](docs/COMMON_AI_MISTAKES.md) |
| Pre-PR workflow | [docs/architecture/DEVELOPMENT_WORKFLOW.md](docs/architecture/DEVELOPMENT_WORKFLOW.md) |
| Content and translations | [docs/CONTENT_POLICY.md](docs/CONTENT_POLICY.md) |

## Before Writing Code

1. Read the relevant ADR if it exists (`docs/adr/`)
2. Consult [COMMON_AI_MISTAKES.md](docs/COMMON_AI_MISTAKES.md) to avoid known antipatterns
3. Follow [CODING_GUIDELINES.md](docs/CODING_GUIDELINES.md) for style and conventions

## Markdown Guidelines

- **Line length**: Keep lines ≤120 characters (enforced by markdownlint)
- Long lines must be broken into multiple lines before validation
- This applies to all `.md` files: posts, documentation, ADRs, etc.

## When You Create Content

**Standalone pages:**

- Create in `/apps/web/src/pages/{en,es}/filename.md`
- REQUIRED: update `apps/web/src/domain/standalonePage.ts` with localized slugs
- Validate: `pnpm run build`

**Tags in content:**

- Use ONLY tags from registry: `apps/web/src/domain/tags.ts`
- Don't invent new tags
- If you need a tag: add it first to `tags.ts` with ES/EN translations

## Before Proposing PR

```bash
pnpm run build
pnpm run lint
pnpm run test:unit
pnpm run test:e2e
```

**Checklist:**

- [ ] Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — understand the 3 principles
- [ ] Read relevant ADR (`docs/adr/`) — understand previous decisions
- [ ] Follow [docs/CODING_GUIDELINES.md](docs/CODING_GUIDELINES.md) — style + type safety
- [ ] **If AI generated code**, reviewed [docs/COMMON_AI_MISTAKES.md](docs/COMMON_AI_MISTAKES.md) to avoid
  antipatterns
- [ ] Ran complete pipeline: commands above
- [ ] All tests pass locally
- [ ] PR has clear description (what, why, references to ADRs)
