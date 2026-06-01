# Estrategia de Pruebas

Este documento explica el objetivo de las pruebas unitarias y E2E en este repositorio, la elección de frameworks,
patrones recomendados y cómo ejecutarlas localmente y en CI.

## Objetivos

- Pruebas unitarias (unit): verificar la lógica de unidades aisladas (funciones, módulos, clases).
  Deben ser rápidas, determinísticas y sin red ni FS real.
- Pruebas end-to-end (E2E): validar flujos de usuario
  y la integración entre componentes y servicios en entornos reales o de preview.
- En CI: proteger PRs con suite automática, almacenar cobertura (solo unit), y aportar reportes E2E.

## Elección de frameworks

- Unit — `Vitest`
- E2E — `Playwright`

Para el razonamiento y la justificación de cada elección, ver [ADR 002](./adr/002-testing-framework-migration.md).

## Objetivos concretos por tipo de prueba

- Unit
  - Cubrir reglas de negocio, transformaciones, utilidades
    y componentes puros (no renderizados complejos de UI salvo que sean componentes aislados).
  - Criterios: rápidas (<50ms por test), independientes, con datos de prueba (factories) y mocks para dependencias externas.
  - Cobertura: genera `lcov` y se sube como artifact desde el job `unit-tests` en CI.

- E2E
  - Verificar rutas críticas: flujo de publicación, navegación principal, interacciones clave.
  - Mockear terceros (analytics, widgets) para evitar flakiness;
    cuando sea necesario probar integraciones reales, usar entornos de preview y inputs del workflow.

## Organización del código de pruebas

- Unit tests: `tests/unit/**` (usar TypeScript)
- E2E tests: `tests/e2e/**`; la lógica de acceso y flujo se organiza en tres capas:
  - **Page** (`tests/pages/*Page.ts`): POM puro — solo locators y helpers de acceso al DOM, sin acciones complejas.
  - **User Journey** (`tests/pages/*UserJourney.ts`): encapsula un flujo de usuario concreto;
    compone Pages y `PageHelper`, expone pasos tipados (`shouldHave*`, `toggle*`, etc.) y su propio factory
    (`userIn*`) que incluye navegación, mocks y estado inicial.
  - **Spec** (`tests/e2e/**/*.spec.ts`): orquesta únicamente con Given/When/Then sobre el User Journey devuelto
    por el factory; no contiene lógica de setup ni locators directos.
- Mocks y utilidades de pruebas compartidas: `tests/utils/` o `tests/e2e/helpers/`

## Patrones y buenas prácticas

- Unit
  - Nombres de test descriptivos: `describe('módulo') / it('debe devolver X cuando Y')`
  - AAA: Arrange / Act / Assert
  - Mockear dependencias externas con `vi.mock()` y usar `vi.resetModules()` cuando importes módulos dinámicamente
  - Evitar `any`; preferir datos fuertemente tipados y factories para crear fixtures
  - Preferir pruebas unitarias sociables:
    probar módulos con dependencias reales y mocks mínimos,
    para evitar el coste y la fragilidad de mocks que no aportan valor.

- E2E
  - Arquitectura de tres capas: **Page → User Journey → Spec**.
  - **Page** (`*Page.ts`): solo locators y selectores. No contiene lógica de navegación ni assertions.
  - **User Journey** (`*UserJourney.ts`): encapsula un flujo de usuario bien definido.
    - Compone uno o más Page Objects y `PageHelper`.
    - Provee métodos de alto nivel tipados: `shouldHave*`, `toggle*`, `hrefMatches`, etc.
    - Incluye un factory (`userIn*`) que orquesta el setup completo (navegación, mocks, estado inicial)
      y devuelve el Journey listo para usar desde el spec.
    - Cada Journey cubre un flujo cohesivo; si los métodos necesarios divergen mucho, crear un Journey separado
      (p.ej. `HomeUserJourney` para smoke home y `ThemeLocaleUserJourney` para tema/locale).
    - No usar patrones «actor» con estado inyectable y tipos débiles: el Journey define todo lo necesario.
  - **Spec**: usa únicamente Given/When/Then sobre el objeto retornado por el factory. Sin locators directos.
  - Las `actions` en `tests/actions/` se reservan para composiciones que no encajan en un Journey
    (iframes, callbacks externos, flujos multi-página sin origen común).
  - Localizadores estables: preferir selectores accesibles soportados por Playwright
    (p. ej. `getByRole` / selectores ARIA). Si no es práctico, usar `data-testid` como atributo estable.
    Evitar selectores frágiles (clases que cambian)
  - Mockear recursos externos con `page.route()` o proveedores locales en CI para mantener tests deterministas
  - Timeouts razonables y checks por visibilidad/atributos en vez de sleeps

## Convenciones de ejecución

- Local
  - Unit (watch): `npm run test:unit` (o `vitest --watch`)
  - Unit (UI): `npm run test:unit:ui` (`vitest --ui`)
  - E2E: `npm run test:e2e` (ejecuta `npx playwright test`)
  - Ejecutar tests E2E en modo `headed` para depuración: `npx playwright test --headed`

- CI
  - Workflow `Tests` (archivo `.github/workflows/tests.yml`) ejecuta dos jobs en paralelo:
    - `unit-tests`: runs on push/PR (no en `workflow_dispatch`),
      ejecuta `vitest --run --coverage` y sube `coverage/` como artifact
    - `e2e-tests`: ejecuta Playwright;
      habilitado también para `workflow_dispatch` para ejecutar E2E contra cualquier `base_url` (input del workflow)

## Cobertura

- Solo el job `unit-tests` genera cobertura (`lcov.info`) y la sube como artifact `vitest-coverage`.

## Ejemplos y referencias

Evita incluir snippets de implementación en este documento.
En su lugar, consulta los ejemplos concretos ya existentes en el repositorio:

- Ejemplos de helpers/mocks E2E: `tests/e2e/helpers/mockGiscus.ts`
- Ejemplos de specs E2E: `tests/e2e/functional/blog.post.spec.ts`, `tests/e2e/a11y/charla.a11y.spec.ts`
- Ejemplos de tests unitarios y mocks: `tests/unit/i18n/utils.test.ts`, `tests/unit/client/themeToggle.test.ts`
- Ejemplo de Page (locators): `tests/pages/SidebarPage.ts`, `tests/pages/HomePage.ts`
- Ejemplo de User Journey: `tests/pages/HomeUserJourney` (en `HomePage.ts`), `tests/pages/ThemeLocaleUserJourney.ts`
- Spec usando User Journey: `tests/e2e/smoke/homepage.spec.ts`, `tests/e2e/functional/theme/color-switch.spec.ts`

## Recomendaciones finales

- Mantén las suites unitarias veloces y confiables; reserva E2E para flujos reales.
- Documenta cualquier test E2E flakey y aisla su ejecución (tag/grep) para no romper CI constantemente.
- Revisa periódicamente el tamaño de la suite E2E y prioriza rutas críticas.

Si quieres, puedo:

- Añadir plantillas de archivos para `tests/pages/` (POM) y `tests/unit` (estructura mínima), o
- Añadir el paso de subida de `lcov.info` a Codecov en el job `unit-tests`.
