---
id: ADR-016
title: Adopt a pnpm workspace monorepo for the website
status: proposed

date: 2026-08-18
last_updated: null

authors:
  - Sergio Carlos Orozco Torres

categories:
  - Architecture

supersedes: []
superseded_by: null

related:
  - constitution.md
  - ADR-014

tags:
  - monorepo
  - architecture
  - workspace
  - app-structure
---

## Context

The project has grown beyond a single application layout.
The codebase already contains a clear separation between domain logic,
content concerns, i18n, testing, and Astro-specific presentation concerns,
but those responsibilities are still physically concentrated inside a single
application root.

This organization makes the project harder to evolve as a reusable platform,
especially when the goal is to keep the website app focused while enabling
independent work on shared logic and test infrastructure.

The current alias-based structure already suggests a stronger architectural
boundary, but the repository still behaves like a single application rooted at
`src`.

A monorepo workspace would allow the project to evolve without forcing a full
rewrite of the application model. It also aligns with the constitutional
principles of Domain First, Framework-Agnostic Core, and Quality by Design.

## Objective

Provide a simple structural migration that preserves the current project,
allows the website to live as a dedicated app, and creates a clear path for
future package extraction without unnecessary redesign.

## Decision

Secorto shall adopt a monorepo workspace structure with a dedicated app entry
for the website.

The repository will use a root workspace model where the app is organized under:

```text
apps/web
```

The root workspace will act as the coordination layer for repository-level
configuration and tooling, while the actual website remains the primary app.

The initial migration will prioritize structural clarity and build stability
over premature extraction of reusable package boundaries.

This decision intentionally keeps the project evolution gradual: the app moves
into its own workspace entry first, and package extraction can occur later once
usage patterns are clearer.

## Implementation

The project will evolve toward a structure similar to:

```text
repo/
  apps/
    web/
      src/
      tests/
      package.json
  packages/
    (future package boundaries)
  package.json
```

This decision does not require an immediate extraction of all domain logic into
independent packages. Instead, it introduces the workspace boundary needed to
support future modularization while keeping the current application working.

Detailed implementation notes may evolve in the architecture documentation.

## Consequences

### Positive

- The app gains a clear workspace boundary.
- The repository becomes easier to scale without a single monolithic layout.
- Tooling can be organized at the workspace root while the app remains focused.
- Future package extraction becomes easier and less disruptive.
- The current project history remains preserved while the architecture evolves.

### Trade-offs

- The migration introduces temporary configuration churn.
- Some root-level scripts and config paths need adaptation.
- The initial structure may not yet fully exploit package-level boundaries.

### Rejected Alternatives

#### Full package extraction in the same change

A bigger refactor would extract domain logic and adapters immediately.

Rejected because it increases migration risk before the monorepo layout has been
proven stable.

#### No workspace change

Keep everything under a single app root.

Rejected because the project already shows signs of growing beyond a single-app
layout and the workspace boundary is a safer long-term direction.

## References

- Constitution
- ADR-014
- Architecture documentation
- Current alias-driven import strategy in TypeScript and Vitest config
