---
title: "Por qué migré a Astro: velocidad, dependencia y simplicidad"
date: 2026-02-13
summary: "Motivos técnicos y de producto para mover el sitio de Gatsby a Astro, con ejemplos y pasos de migración."
draft: true
tags: [astro, migration, performance]
lang: es
---

## Motivación

Gatsby ofrecía poder y flexibilidad, pero el coste de mantenimiento se
volvió mayor que el beneficio: dependencias, builds largos y cfg opaca.
Astro ofrecía:

- Builds mucho más rápidos (Vite/esbuild).
- Menos plugins necesarios y más control sobre JS en cliente.
- Content Collections tipadas y TypeScript strict.

## Pasos de migración (resumen)

1. Migrar archivos MDX → Markdown/collections.
2. Reescribir templates React → componentes Astro.
3. Reimplementar el tema (tokens de diseño) y el switch light/dark.
4. Migrar tests: conservar pruebas E2E, introducir `Vitest` para unit.

## Resultado

- Menor tiempo de build (~30s típicos), menor superficie de dependencias,
  y mayor confianza al refactorizar gracias a TypeScript.

## Notas / TODO
- Añadir fragmentos de `astro.config.mjs` y `src/content.config.ts`.
- Documentar scripts que automatizan la migración de frontmatter y slug.
