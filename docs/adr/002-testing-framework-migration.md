---
id: ADR-002
title: Migración de Cypress a Playwright + Vitest
status: accepted
date: 2025-07
last_updated: 2026-08-29
categories:
  - Testing
  - Tooling
  - CI
---

## Contexto

La estrategia de testing dependía exclusivamente de Cypress para pruebas E2E y no contaba con un framework de tests unitarios.
A medida que la suite creció, surgieron problemas operativos y técnicos que afectaban la velocidad,
la cobertura y la estabilidad del pipeline de CI.

Entre los factores más relevantes:

- Dependencia de un servicio SaaS con límites de ejecución mensuales.
- Restricciones técnicas del runner (modelo single‑tab, navegadores soportados, interceptación limitada).
- Ausencia de un framework unitario que permitiera aislar lógica y reducir carga en E2E.

Estos elementos generaron fricción en PRs, lentitud en validaciones y
dificultades para mantener una estrategia de testing sostenible.

## Decisión

Adoptar una arquitectura de testing basada en dos herramientas complementarias:

- **Playwright** como framework E2E principal.
- **Vitest** como framework unitario.

La migración se realizará en dos fases: convivencia temporal con Cypress
y posterior eliminación del runner antiguo una vez alcanzada la paridad funcional.

## Motivación

- Eliminar la dependencia de un servicio con límites de ejecución que afecta la estabilidad del CI.
- Ampliar la cobertura de navegadores, incluyendo WebKit/Safari.
- Mejorar la capacidad de mocking e interceptación de terceros.
- Reducir la carga de E2E trasladando lógica pura a tests unitarios rápidos.
- Consolidar un ecosistema coherente basado en TypeScript y herramientas compatibles con Astro.

## Consecuencias

### Positivas

- CI sin restricciones de ejecución y con mayor estabilidad.
- Cobertura unitaria completa para lógica de negocio.
- Suite E2E más robusta y con soporte multi‑navegador.
- Mejor capacidad de debugging mediante traces ligeros.
- Ecosistema homogéneo: Vitest + Playwright comparten convenciones y toolchain.

### Consideraciones

- La fase de convivencia requiere criterios claros de paridad.
- La eliminación de Cypress implica revisar artefactos, configuraciones y dependencias históricas.

## Referencias

- [ADR 003 — Mocks de terceros](003-third-party-mocks.md)
- [docs/TESTING_STRATEGY.md](../architecture/TESTING_STRATEGY.md) — Estrategia general

### Anexos

- [Fase de convivencia](./anexos/002-testing-framework-migration/convivencia.md)
  Se agregó Playwright; ambos runners E2E se ejecutaron en CI durante la fase de convivencia
  (criterios de paridad documentados)
- [Fase de eliminación](./anexos/002-testing-framework-migration/eliminacion.md)
  Checklist de artefactos y verificaciones realizadas al retirar el runner antiguo
  (registro de decisiones y puntos de validación)
- [Métricas y artefactos](./anexos/002-testing-framework-migration/technical-evidence.md)
  Resumen de métricas y artefactos recopilados
