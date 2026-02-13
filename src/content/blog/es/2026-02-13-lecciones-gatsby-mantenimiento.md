---
title: "Lecciones desde Gatsby: cuando React y MDX se vuelven mantenimiento"
date: 2026-02-13
summary: "Qué salió bien y qué salió mal al usar Gatsby para mi sitio: dependencias, GraphQL, snapshot testing y performance."
draft: true
tags: [gatsby, testing, performance, lessons]
lang: es
---

## Contexto

En 2021 reescribí el sitio con Gatsby para obtener componentización y usar
React/MDX. Pronto el proyecto creció en complejidad por plugins y
configuración.

## Problemas principales

- Ecosistema de plugins (~34) con actualizaciones rompientes.
- `gatsby-node.js` centralizaba mucha lógica (previous/next cross-references),
  lo que aumentaba tiempos de build (~3 min).
- Snapshot testing útil pero frágil; demasiados falsos positivos.

## Qué haría distinto

- Evitar dependencia excesiva en plugins; preferir transformaciones
  simples en build scripts.
- Priorizar tests unitarios rápidos (Vitest) sobre snapshots masivos.
- Externalizar la lógica de cross-references a un script prebuild que
  genere metadatos simples.

## Extractos técnicos

- Cómo identifiqué que el `previous/next` era la causa del slowdown.
- Ejemplo de script para generar `prev/next` sin GraphQL (Node script).

## Notas / TODO

- Incluir ejemplos de commits y PRs.
- Añadir métricas de build (antes/después).
