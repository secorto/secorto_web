---
title: Why I use npm (updated)
tags:
  - dev
  - tools
excerpt: npm is a solid ally for frontend development; in this update I explain why I use it and how it compares to Yarn and pnpm
date: 2025-12-26
translation_status: 'translated'
translation_origin:
  locale: 'es'
  id: 'por-que-uso-npm-2025'
---

This is an analysis of why this blog uses npm and why, for this specific project, it remains the most practical choice.

## What is dependency management

Dependency management tools help installing, updating and publishing libraries and utilities used across a project.

## Why I used Bower (history)

Years ago I used Bower because it was convenient to manage front-end assets (CSS/JS) with little complexity: it centralized dependencies and made it simple to copy resources into the build.

## Why I chose to stick with NPM

Over time npm expanded its ecosystem and now provides most of the packages and utilities that previously required Bower. Also, this blog already used npm for static site generation dependencies, so keeping a single manager simplifies the pipeline and avoids duplicated files and lockfiles.

## Why automate tasks

Automation reduces repetitive work and human errors. Tasks like optimizing images, compiling SCSS, concatenating/minifying CSS and JS, or copying fonts into the output directory can be performed reliably with scripts.

For this site I prefer to centralize those steps in npm scripts rather than adding another layer of tooling.

## NPM vs Yarn vs pnpm — context and decision

- Yarn: in professional environments I usually use Yarn (especially Yarn v1 in legacy projects) because it historically provided performance and lockfile improvements. Yarn introduced useful ideas (workspaces, determinism) that influenced the ecosystem.

- pnpm: a modern alternative that saves disk space (by storing packages in a global store) and is often faster on repeated installs. Its different hoisting behavior sometimes requires adjustments in projects not prepared for it.

For this blog I prefer to stay with npm for simplicity and compatibility: I don't need pnpm's advanced features, and using npm avoids confusing contributors or deployment services that expect the standard flow. In professional projects I consider Yarn or pnpm when the project requires it (monorepos, large teams, CI optimization), but here the choice is deliberate: ease of maintenance and no extra magic.

If you want to experiment with pnpm, try it in a branch first and verify that dependencies and any scripts manipulating paths still behave correctly.

## Why npm is enough for this blog

Because I can run the full build and auxiliary tasks via `npm run ...`, the needed dependencies are published to the registry and I don't need special install behavior. Keeping the toolchain minimal reduces complexity and the barrier to occasional contributions.

---

If you'd like, I can add examples of `npm run build` / `npm run dev` to the README or to the post itself, or create an alternative workflow for Yarn/pnpm in a branch.
