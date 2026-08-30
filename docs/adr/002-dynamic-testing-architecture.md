---
id: ADR-002
title: Adopción de una arquitectura de testing dinámica por capas
status: accepted
date: 2025-07
last_updated: 2026-08-29
categories:
  - Testing
  - Tooling
  - CI
---

## Contexto

La estrategia de testing original dependía de un único runner E2E (Cypress) y carecía de una capa
unitaria que permitiera aislar lógica pura. A medida que el proyecto creció, esta arquitectura
monolítica generó problemas estructurales:

- Validación de lógica en E2E por falta de pruebas unitarias.
- Lentitud y fragilidad del pipeline debido a dependencias externas.
- Límites operativos del runner (modelo single‑tab, navegadores soportados, interceptación limitada).
- Dependencia de un servicio SaaS con restricciones mensuales de ejecución.
- Dificultad para escalar la suite y mantener estabilidad en CI.

Estos factores evidenciaron que el problema no era la herramienta en sí, sino la **arquitectura de
testing**: un diseño centrado en un único runner que no podía sostener la evolución del sistema.

## Decisión

Adoptar una **arquitectura de testing dinámica por capas**, compuesta por:

- **Capa unitaria** para validar lógica pura de forma rápida, determinista y aislada.
- **Capa de integración ligera** para contratos internos y adaptadores.
- **Capa E2E moderna** para flujos críticos del usuario en navegadores reales.
- **Pipeline de CI resiliente**, sin depender del ritmo ni de las limitaciones de un runner único.

## Motivación

- Superar las limitaciones de un runner único que bloqueaba la evolución del sistema.
- Reducir la carga de E2E trasladando lógica pura a pruebas unitarias rápidas.
- Mejorar la capacidad de mocking e interceptación de terceros.
- Ampliar la cobertura de navegadores, incluyendo WebKit/Safari.
- Garantizar estabilidad del CI eliminando dependencias SaaS con límites operativos.
- Consolidar un ecosistema coherente basado en TypeScript y herramientas compatibles con Astro.

## Consecuencias

### Positivas

- Arquitectura de testing escalable y resiliente.
- CI sin restricciones de ejecución y con mayor estabilidad.
- Cobertura unitaria completa para lógica de negocio.
- Suite E2E más robusta y con soporte multi‑navegador.
- Mejor capacidad de debugging mediante traces ligeros.
- Ecosistema homogéneo: Vitest + Playwright comparten convenciones y toolchain.

### A considerar

- La fase de convivencia requiere criterios claros de paridad.
- La eliminación del runner antiguo implica revisar artefactos, configuraciones y dependencias históricas.
- Las decisiones operativas relacionadas con dependencias bloqueantes se alinean con la política transversal definida en ADR‑013.

## Referencias

- [ADR 003 — Mocks de terceros](003-third-party-mocks.md)
- [docs/TESTING_STRATEGY.md](../architecture/TESTING_STRATEGY.md) — Estrategia general

### Anexos

- [Fase de convivencia](./anexos/002-dynamic-testing-architecture/convivencia.md)
  Se agregó Playwright; ambos runners E2E se ejecutaron en CI durante la fase de convivencia
  (criterios de paridad documentados)
- [Fase de eliminación](./anexos/002-dynamic-testing-architecture/eliminacion.md)
  Checklist de artefactos y verificaciones realizadas al retirar el runner antiguo
  (registro de decisiones y puntos de validación)
- [Métricas y artefactos](./anexos/002-dynamic-testing-architecture/technical-evidence.md)
  Resumen de métricas y artefactos recopilados
