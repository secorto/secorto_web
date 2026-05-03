# ADR 002: Migración de Cypress a Playwright + Vitest

> **Estado:** Aceptada
> **Fecha:** 2025-07
> **Categoría:** Testing / Tooling / CI

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

## Estado de la migración

### Completado ✅

| Área | Cypress | Playwright/Vitest |
| --- | --- | --- |
| Accesibilidad (axe) | `cypress-axe` | `@axe-core/playwright` |
| Blog (list, post) | `blog.cy.ts` | `blog.list.spec.ts`, `blog.post.spec.ts` |
| Charlas | `charla.cy.ts` | `charla.spec.ts`, `charla.a11y.spec.ts` |
| Color switch | `color-switch.cy.ts` | `color-switch.spec.ts` |
| Homepage | `main-page.cy.ts` | `homepage.spec.ts` |
| Mocks de terceros | `stubs.ts` (cy.intercept) | `helpers/mock*.ts` (page.route) |
| Lógica de negocio | — (no existía) | 165+ tests unitarios, 100 % cobertura |

### Pendiente ⏳

- Eliminar dependencias de Cypress (`cypress`, `cypress-axe`)
- Eliminar `cypress.config.js` y carpeta `cypress/`
- Actualizar `npm run test` para que apunte a Playwright
- Eliminar `projectId` de Cypress Cloud de la configuración

### Artefactos de Cypress aún presentes

```text
cypress/
├── e2e/
│   ├── accessibility.cy.ts
│   ├── blog.cy.ts
│   ├── charla.cy.ts
│   ├── color-switch.cy.ts
│   ├── main-page.cy.ts
│   └── stubs.ts
└── support/
```

Estos archivos se mantienen temporalmente como referencia de paridad.

---

## Organización de tests actual

### Tests unitarios — Vitest

```text
tests/unit/           ← 165+ tests, 100 % cobertura
├── sections.test.ts
├── sectionLoader.test.ts
├── sectionContext.test.ts
├── staticPathsBuilder.test.ts
├── paths.test.ts
├── ids.test.ts
├── navLinks.test.ts
├── dateFormat.test.ts
└── ...
```

### Tests E2E — Playwright

```text
tests/e2e/
├── a11y/             ← Tests de accesibilidad (axe-core)
│   └── charla.a11y.spec.ts
├── functional/       ← Tests de funcionalidad específica
│   ├── blog.list.spec.ts
│   ├── blog.post.spec.ts
│   ├── color-switch.spec.ts
│   ├── homepage.language.spec.ts
│   ├── menu.spec.ts
│   ├── robots.spec.ts
│   ├── rss.spec.ts
│   ├── theme-load.spec.ts
│   └── theme-persistence.spec.ts
├── helpers/          ← Mocks y utilidades compartidas
│   ├── mockGiscus.ts
│   ├── mockSlides.ts
│   ├── mockThirdParty.ts
│   ├── mockYouTube.ts
│   └── whenMocked.ts
└── smoke/            ← Tests de humo (verificación rápida)
    ├── charla.spec.ts
    ├── community.titles.spec.ts
    ├── footer.spec.ts
    ├── homepage.spec.ts
    ├── project.titles.spec.ts
    └── work.titles.spec.ts
```

---

## CI

El workflow `Tests` (`.github/workflows/tests.yml`) ejecuta dos jobs en
paralelo:

```text
unit-tests:    vitest --run --coverage  → artifact vitest-coverage
e2e-tests:     playwright test          → artifact playwright-report
```

- **`unit-tests`** se ejecuta en push/PR (no en `workflow_dispatch`)
- **`e2e-tests`** se ejecuta siempre, incluyendo `workflow_dispatch` para
  validar entornos de preview con un `base_url` configurable
- **Sin límite de ejecuciones:** a diferencia de Cypress Cloud, no hay
  restricción en el número de runs mensuales

---

## Comparación directa

| Criterio | Cypress | Playwright |
| --- | --- | --- |
| Límite mensual CI | **500 ejecuciones** (Cloud) | **Sin límite** |
| Navegadores | Chromium, Firefox | Chromium, Firefox, **WebKit** |
| Interceptación de red | `cy.intercept()` | `page.route()` (más flexible) |
| Multi-tab/ventana | ❌ | ✅ |
| Traces/debugging | Video + screenshots (~pesados) | Trace ZIP (~livianos) |
| Page Object Model | Manual | Fixtures nativos |
| Coste (CI recording) | Gratis limitado / pago | Gratis ilimitado |
| API de mocking | Limitada | `route.fulfill()` con body, headers, status |

| Criterio | — (sin framework) | Vitest |
| --- | --- | --- |
| Tests unitarios | No existían | 165+ tests |
| Cobertura | No medible | 100 % (statements, branches, functions, lines) |
| Velocidad | — | < 1 s toda la suite |
| Mocking | — | `vi.mock()`, `vi.fn()`, `vi.spyOn()` |
| TypeScript | — | Nativo |

---

## Consecuencias

### Positivas

- **Sin techo de ejecuciones:** CI nunca se queda sin presupuesto de tests
- **Cobertura unitaria:** la lógica de negocio (router, i18n, paths, tags)
  está cubierta al 100 % con tests rápidos
- **Multi-navegador:** WebKit/Safari cubierto en la suite E2E
- **Mocks superiores:** `page.route()` permite el sistema de mocks
  documentado en [ADR 003](003-third-party-mocks.md)
- **Un solo ecosistema:** Vitest + Playwright comparten configuración
  TypeScript y convenciones

### A tener en cuenta

- La migración completa requiere eliminar Cypress como dependencia y sus
  archivos residuales
- Playwright requiere instalar los binarios de navegador
  (`npx playwright install`) en CI y localmente
- El equipo debe familiarizarse con la API de Playwright si venía de
  Cypress (`cy.get()` → `page.locator()`, `cy.intercept()` → `page.route()`)

---

## Anexos

- [METRICS_FOR_PRESENTATION.md](./anexos/002-testing-framework-migration/METRICS_FOR_PRESENTATION.md) —
  Métricas y artefactos para presentación y migración

Nota operativa: cualquier cambio en la decisión de testing
(frameworks, mocks o CI) debe reflejarse en `docs/TESTING_STRATEGY.md`
y en los anexos relacionados para mantener la coherencia operativa.

## Referencias

- [Playwright vs Cypress](https://playwright.dev/docs/why-playwright)
- [Cypress Cloud Pricing](https://www.cypress.io/pricing) — límite de 500
  ejecuciones en plan gratuito
- [Vitest](https://vitest.dev/)
- [ADR 003 — Mocks de terceros](003-third-party-mocks.md)
- [docs/TESTING_STRATEGY.md](../TESTING_STRATEGY.md) — Estrategia general
