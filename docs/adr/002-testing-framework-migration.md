---
title: ADR 002 - Migración de Cypress a Playwright + Vitest
status: accepted
date: 2025-07
last_updated: null
categories:
  - Testing
  - Tooling
  - CI
---

## Contexto

El proyecto usaba **Cypress** como framework E2E y no tenía framework de
tests unitarios dedicado. A medida que la suite creció, se presentaron
varios problemas:

### Límite de ejecuciones en Cypress Cloud

Cypress Cloud (antes Cypress Dashboard) impone un **límite de 500
ejecuciones de tests por mes** en su plan gratuito. Una "ejecución" se cuenta
por cada `spec file` ejecutado en CI, no por test individual. Con una suite
de ~12 specs ejecutándose en cada push y PR, el presupuesto mensual se agotaba
rápidamente:

```text
12 specs × ~3 PRs/semana × 4 semanas = ~144 ejecuciones/mes (solo PRs)
+ pushes a main + re-runs por flakiness → fácilmente > 500/mes
```

Al superar el límite, **CI deja de reportar resultados** de tests E2E hasta
el siguiente ciclo de facturación, dejando PRs sin validación.

### Limitaciones técnicas de Cypress

- **Modelo single-tab:** Cypress no soporta múltiples tabs ni ventanas
  nativamente, limitando tests de flujos con redirecciones externas.
- **Navegadores limitados:** solo Chromium y Firefox; sin soporte para
  WebKit/Safari.
- **Interceptación de red:** `cy.intercept()` tiene menos control que
  `page.route()` de Playwright para mocks de servicios.
- **Debugging en CI:** los artifacts de Cypress (videos, screenshots) son
  más pesados que los traces de Playwright.

### Ausencia de framework unitario

No había framework de tests unitarios. Toda verificación pasaba por E2E,
lo cual:

- Hacía los tests lentos (incluso para lógica pura como formateo de fechas)
- Aumentaba el consumo del límite de 500 ejecuciones
- Hacía difícil alcanzar cobertura de código medible

---

## Decisión

Adoptar **Playwright** como framework E2E y **Vitest** como framework
unitario, manteniendo Cypress temporalmente hasta completar la migración.

### Playwright para E2E

- **Multi-navegador nativo:** Chromium, Firefox y WebKit en un solo comando
- **`page.route()`:** interceptación de red precisa para mocks de terceros
  (ver [ADR 003](003-third-party-mocks.md))
- **Sin límite de ejecuciones:** runner open-source sin SaaS obligatorio
- **Traces livianos:** archivo `.zip` con snapshots del DOM, red y consola
  para debugging post-mortem
- **Fixtures y POM:** soporte nativo para Page Object Model y fixtures
  reutilizables

### Vitest para tests unitarios

- **Integración con TypeScript/Vite:** configuración mínima, compatible con
  el toolchain de Astro
- **API compatible con Jest:** curva de aprendizaje baja
- **`vi.mock()` y `vi.fn()`:** mocking de módulos para aislar lógica
- **Cobertura integrada:** genera `lcov` para integración con servicios de
  cobertura
- **Ejecución rápida:** tests unitarios en < 1 s

---

## Comparación directa

| Criterio | Cypress | Playwright |
| --- | --- | --- |
| Límite mensual CI | Limitado (SaaS) | Sin límite (open-source) |
| Navegadores | 2 | 3 (+ WebKit/Safari) |
| Interceptación de red | Básica | Avanzada con control fino |
| Multi-tab/ventana | ❌ | ✅ |
| Page Object Model | Manual | Fixtures nativos |
| Coste CI | Gratis limitado / pago | Gratis ilimitado |

| Criterio | Sin framework | Vitest |
| --- | --- | --- |
| Tests unitarios | No existían | Cobertura mensurable |
| Velocidad | — | Rápida (< 1 s suite completa) |
| Mocking de módulos | — | Nativo |
| TypeScript | — | Soporte nativo |

---

## Consecuencias

### Positivas

- **Escalabilidad de CI:** framework E2E sin límites de ejecuciones en CI
  (SaaS o runner open-source).
- **Cobertura unitaria:** cobertura de lógica crítica con tests deterministas
  y rápidos.
- **Multi-navegador:** soporte para múltiples navegadores (Chromium, Firefox,
  WebKit) en una sola suite.
- **Mocks superiores:** interceptación de red avanzada para aislar dependencias
  externas (ver [ADR 003](003-third-party-mocks.md)).
- **Ecosistema unificado:** ambos frameworks comparten TypeScript y toolchain.

### Consideraciones

- Mayor número de dependencias dev a mantener.
- Requiere disciplina en estructura de tests para mantener separación entre
  unitarios y E2E.

## Referencias y detalles de implementación

Para configuración específica de CI, estructura de directorios, comandos y
artefactos:
ver [docs/architecture/TESTING_STRATEGY.md](../../architecture/TESTING_STRATEGY.md)
y anexos:

- [Fase de convivencia](./anexos/002-testing-framework-migration/convivencia.md)
  Se agregó Playwright; ambos runners E2E se ejecutaron en CI durante la fase de convivencia
  (criterios de paridad documentados)
- [Fase de eliminación](./anexos/002-testing-framework-migration/eliminacion.md)
  Checklist de artefactos y verificaciones realizadas al retirar el runner antiguo
  (registro de decisiones y puntos de validación)
- [Métricas y artefactos](./anexos/002-testing-framework-migration/METRICS_FOR_PRESENTATION.md)
  Resumen de métricas y artefactos recopilados para presentación y toma de decisión

## Referencias

- [Playwright vs Cypress](https://playwright.dev/docs/why-playwright)
- [Cypress Cloud Pricing](https://www.cypress.io/pricing) — límite de 500
  ejecuciones en plan gratuito
- [Vitest](https://vitest.dev/)
- [ADR 003 — Mocks de terceros](003-third-party-mocks.md)
- [docs/TESTING_STRATEGY.md](../TESTING_STRATEGY.md) — Estrategia general
