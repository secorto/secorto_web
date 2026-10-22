---
title: Testing Foundation
layout: '@layouts/StandalonePageLayout.astro'
translationKey: testing-foundation
description: How quality is woven into every decision from the start
---

## 🎯 A Single Conviction

Quality doesn't live in a test report. It lives in how we think about validation.

Every test, every assertion, every mock reflects one principle:
**the system must prove itself correct at every stage**. Not after deployment. Not in staging.
*During development*.

This means testing isn't a checkpoint at the end. It's the language we use to
think about the system.

---

## 🏗️ Three Validation Pillars

### 1. **Shift Left** — Find Issues Early

When tests run during development, not production, something magical happens:
you catch problems before they become expensive.

The consequence? Unit tests validate business logic before UI rendering.
Linting catches structural issues before runtime. Each layer is tested in isolation,
integration validated in E2E.

This is how you build systems where quality is a built-in feature.

### 2. **Deterministic Mocks** — Control the World

When third-party services are mocked, tests become reproducible.
No flaky waits for external APIs. No "it passed locally but failed in CI".

Mock strategy isn't about avoiding reality; it's about controlling what you can control,
so you can test what matters.

This is how you build reliable test suites.

### 3. **CI/CD as Enforcement** — Automated Guardrails

When linting, type checking, and testing are part of the pipeline, they're not optional.

Every commit must pass all stages. The machine validates coherence automatically.
No "we'll fix that later"—the system won't let you ship broken code.

This is how you build systems that respect themselves.

---

## 🌱 Why It Matters

A system validated this way has profound consequences:

- **Safety**: Errors are caught before users see them
- **Velocity**: When tests are part of the thinking, iteration is fast
- **Clarity**: Tests that run cleanly are tests that explain intent
- **Collaboration**: Automated guardrails eliminate ambiguity

You're not just writing tests. You're building a system that **validates itself at every step**.

---

## 🔄 The Validation Pipeline — Quality Proven

This isn't theoretical. It's **proven at every commit**.

Before code ever reaches a reviewer, a machine validates it:

1. **Type Checking** — TypeScript verifies contracts are kept
2. **Static Analysis** — ESLint enforces structure, no leaky abstractions  
3. **Unit Tests** — Business logic is tested in isolation
4. **E2E Tests** — Complete user flows validate that testing strategy actually works

Each stage validates a different aspect of quality. Together, they prove the system is sound.

- **Shift Left** → Proven by unit tests running during development
- **Deterministic Mocks** → Proven by E2E tests not flaking despite external dependencies
- **CI/CD as Enforcement** → Proven by the build itself rejecting incoherent code

The pipeline is how the system **proves its own correctness**.

### The Complete Flow

```mermaid
graph TD
    Start["👤 Developer / 🤖 AI"]
    
    Start --> Reads["📖 Reads context<br/>ARCHITECTURE.md<br/>CODING_GUIDELINES.md<br/>Relevant ADR"]
    
    Reads --> Generate["✍️ Generates Code<br/>+ Tests"]
    
    Generate --> Validate["✅ Local Validation Pipeline"]
    
    Validate --> TypeCheck["Type Checking<br/>TypeScript<br/>Type Validation"]
    Validate --> ESLint["Static Analysis<br/>ESLint<br/>Source Code"]
    Validate --> Markdown["Static Analysis<br/>Markdownlint<br/>Documentation"]
    Validate --> Unit["Unit Tests<br/>Vitest<br/>Pure Logic"]
    Validate --> E2E["E2E Tests<br/>Playwright<br/>User Flows"]
    
    TypeCheck --> Results{"Does<br/>Everything<br/>Pass?"}
    ESLint --> Results
    Markdown --> Results
    Unit --> Results
    E2E --> Results
    
    Results -->|No| Fix["🔄 Adjusts<br/>according to feedback"]
    Fix --> Generate
    
    Results -->|Yes| PR["📤 Proposes PR<br/>with description"]
    PR --> Review["👥 Human Review<br/>- Architecture<br/>- Intent<br/>- ADRs respected"]
    
    Review --> Approved{"Approved?"}
    Approved -->|No| Feedback["💬 Feedback"]
    Feedback --> Generate
    
    Approved -->|Yes| Merge["🎉 Merged<br/>to master"]
    Merge --> End["✨ Deployed"]
    
    style Start fill:#7b1fa2,color:#fff
    style Reads fill:#7b1fa2,color:#fff
    style Generate fill:#17A2B8,color:#fff
    style Fix fill:#7b1fa2,color:#fff
    style Feedback fill:#7b1fa2,color:#fff
    style TypeCheck fill:#1e88e5,color:#fff
    style ESLint fill:#1e88e5,color:#fff
    style Markdown fill:#1e88e5,color:#fff
    style Unit fill:#f57c00,color:#fff
    style E2E fill:#f57c00,color:#fff
    style PR fill:#388e3c,color:#fff
    style Review fill:#388e3c,color:#fff
    style Merge fill:#2e7d32,color:#fff
    style End fill:#1b5e20,color:#fff
    style Results fill:#d32f2f,color:#fff
    style Approved fill:#d32f2f,color:#fff
```

**Legend:**

- 🟣 **Reading & Feedback** (purple) — Initial context and correction loops
- 🔷 **Generation** (cyan) — Heart of the workflow (code + tests)
- 🔵 **Type Check + Linting** (blue) — **Static** validation (without running code)
- 🟠 **Unit + E2E Tests** (orange) — **Dynamic** validation (executable)
- 🔴 **Decision Points** (red) — Branching (does it pass? approved?)
- 🟢 **Review + Merge + Deploy** (green) — Human approves, deploys, and closes

---

## 📖 Deeper Exploration

Quality by Design isn't just a testing practice; it's an architecture.

- **[Principles](https://github.com/secorto/secorto_web/blob/master/docs/ARCHITECTURE.md)** —
  How testing connects with overall design
- **[Testing](https://github.com/secorto/secorto_web/blob/master/docs/architecture/TESTING_STRATEGY.md)** —
  Unit, component, page, and flow testing approach
- **[Decisions](https://github.com/secorto/secorto_web/tree/master/docs/adr)** —
  Why these testing choices were made
- **[Workflow](https://github.com/secorto/secorto_web/blob/master/docs/architecture/DEVELOPMENT_WORKFLOW.md)** —
  Validation pipeline in action

For teams interested in implementation details, the repository contains testing examples,
page object patterns, and E2E flows demonstrating shift-left in practice.
