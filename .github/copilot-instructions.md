# Copilot — Brief Instructions

**ENTRY POINT:** [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) — principles and navigation to all documentation

**Visual development flow:**
[docs/architecture/DEVELOPMENT_WORKFLOW.md](../docs/architecture/DEVELOPMENT_WORKFLOW.md) —
how Quality by Design validates at each step.

**Need to do something specific?**
Documents self-reference. E.g., in
[TESTING_STRATEGY.md](../docs/architecture/TESTING_STRATEGY.md) you'll find links to
FLOWS.md and relevant ADRs. In [CODING_GUIDELINES.md](../docs/CODING_GUIDELINES.md)
references to testing and content.

## Stack & Conventions

- Project: TypeScript + Astro
- Tests: Vitest (unit) and Playwright (E2E)
- Style: no semicolons except when necessary

## Core Principle: Quality by Design

Testing integrated at each layer:

1. **Separation of Concerns** — pure logic in `src/domain/`, presentation in Astro components
2. **DRY** — centralized configuration, single source of truth
3. **Type Safety** — TypeScript strict, no `any`, validation at build time

## When You Create Content

- **Blog posts, talks, work, projects, community** → [docs/CONTENT_POLICY.md](../docs/CONTENT_POLICY.md)
  File structure, naming, frontmatter, translationKey, redirects, tags.
- **Standalone pages** (static compiled routes in `/pages/{en,es}/`) → Update `src/domain/standalonePage.ts`
  with localized slugs, run `pnpm run build` to validate

## Markdown Guidelines

- **Line length**: Keep lines ≤120 characters (enforced by markdownlint)
- Long lines must be broken into multiple lines before validation
- This applies to all `.md` files: posts, documentation, ADRs, etc.

## When You Write ADRs

- Use [docs/adr/TEMPLATE.md](../docs/adr/TEMPLATE.md) as canonical template
- **Keep decisions implementation-agnostic:**
  - Use abstract concepts (no class names: e.g., "specialization by responsibility", not "ContentListPage")
  - References to concrete details go in architecture files (docs/architecture/) or technical annexes, not in the ADR
  - This way the ADR remains valid when implementation is refactored
- Requires YAML frontmatter with minimum metadata: `id`, `title`, `status`, `date`, `last_updated`, `categories`
- Recommended structure: Context, Objective, Decision, Motivation, Implementation, Consequences, References, Annexes
- In Consequences use single format: Positive, To Consider, Trade-offs, Rejected Alternatives

## Final Validation Before PR

Before proposing a PR, follow this checklist:

```bash
pnpm run build            # type check + build (all workspaces)
pnpm run lint             # ESLint + markdownlint
pnpm run test:unit        # unit tests (all workspaces)
pnpm run test:e2e         # Playwright E2E (apps/web)
```

**Checklist:**

- [ ] Read [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) — understand the 3 principles
- [ ] Read relevant ADR (`docs/adr/`) — understand previous decisions
- [ ] Follow [docs/CODING_GUIDELINES.md](../docs/CODING_GUIDELINES.md) — style + type safety
- [ ] **If AI generated code**, reviewed [docs/COMMON_AI_MISTAKES.md](../docs/COMMON_AI_MISTAKES.md) to avoid antipatterns
- [ ] Ran complete pipeline: commands above
- [ ] All tests pass locally
- [ ] PR has clear description (what, why, references to ADRs)
