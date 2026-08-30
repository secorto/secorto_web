---
id: ADR-013
title: Manejo de dependencias externas que bloquean la evolución del sistema
status: accepted
date: 2026-08-29
categories:
  - Architecture
  - Tooling
  - Platform
---

## Contexto

El ecosistema técnico del proyecto depende de múltiples herramientas externas: frameworks de testing,
linters, parsers, servicios SaaS y plugins de terceros. En varias ocasiones, dependencias externas han
impedido la evolución del sistema, bloqueando actualizaciones críticas, mejoras de rendimiento o
compatibilidad con nuevas versiones del toolchain.

Ejemplos históricos incluyen:

- un runner E2E con restricciones operativas que afectaba la estabilidad del CI (ver ADR‑002),
- extensiones de análisis estático que impedían actualizar el núcleo del sistema de linting (ver ADR‑013).

Estos casos evidencian la necesidad de una regla arquitectónica clara para manejar dependencias que
bloquean la evolución del proyecto.

## Decisión

Adoptar una política de arquitectura transversal:

> **El proyecto no se deja bloquear por dependencias externas.
> Cuando una herramienta, plugin o servicio impide la evolución del sistema,
> se reemplaza o se desactiva.**

La decisión se aplica independientemente del área afectada (testing, linting, build, CI, i18n,
tooling editorial, etc.). Las acciones concretas se documentarán en ADRs específicos cuando ocurran.

## Motivación

- Mantener la capacidad de evolución del sistema sin depender del ritmo de terceros.
- Reducir deuda técnica causada por herramientas que no actualizan o no escalan.
- Proteger la estabilidad del CI, del build y del análisis estático.
- Mantener compatibilidad con versiones modernas del ecosistema (TypeScript, Astro, parsers, runners).
- Evitar bloqueos prolongados que afecten productividad y calidad.

## Consecuencias

### Positivas

- Ecosistema técnico resiliente y actualizable.
- Migraciones rápidas a nuevas versiones del toolchain.
- Reducción de fricción causada por dependencias obsoletas.
- Mayor control sobre la evolución del proyecto.

### Consideraciones

- Las migraciones deben evaluarse caso por caso.
- Las decisiones específicas se documentarán en ADRs independientes.
- La política no obliga a reemplazar herramientas funcionales; solo actúa ante bloqueos.

## Relación con otros ADRs

- **ADR‑002** — Migración de Cypress a Playwright + Vitest.
- **ADR‑013** — Manejo de dependencias bloqueantes en análisis estático.
