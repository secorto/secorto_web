# Estrategia de Pruebas

Este documento explica el objetivo de las pruebas unitarias y E2E en este repositorio, la elección de frameworks, patrones recomendados y cómo ejecutarlas localmente y en CI.

## Objetivos

- Pruebas unitarias (unit): verificar la lógica de unidades aisladas (funciones, módulos, clases). Deben ser rápidas, determinísticas y sin red ni FS real.
- Pruebas end-to-end (E2E): validar flujos de usuario y la integración entre componentes y servicios en entornos reales o de preview.
- En CI: proteger PRs con suite automática, almacenar cobertura (solo unit), y aportar reportes E2E.

## Elección de frameworks

- Unit: `Vitest`
  - Razonamiento: integración con TypeScript, API compatible con Jest/Vitest, rápido y con `vi.mock` para mocking de módulos.
- E2E: `Playwright`
  - Razonamiento: soporta múltiples navegadores, fixtures robustos, rutas de red (`page.route`) para mocks, control en CI y ejecución local headful/headless.

> Nota: actualmente el repo incluye Cypress; la intención es mantener Playwright como E2E principal. Mantener Cypress temporalmente está bien hasta migrar por completo.

## Objetivos concretos por tipo de prueba

- Unit
  - Cubrir reglas de negocio, transformaciones, utilidades y componentes puros (no renderizados complejos de UI salvo que sean componentes aislados).
  - Criterios: rápidas (<50ms por test), independientes, con datos de prueba (factories) y mocks para dependencias externas.
  - Cobertura: genera `lcov` y se sube como artifact desde el job `unit-tests` en CI.

- E2E
  - Verificar rutas críticas: inicio de sesión (si aplica), flujo de publicación, navegación principal, interacciones clave.
  - Mantener suite pequeña en CI (smoke + algunas rutas), delegar regresiones largas a pipelines nocturnos si procede.
  - Mockear terceros (analytics, widgets) para evitar flakiness; cuando sea necesario probar integraciones reales, usar entornos de preview y inputs del workflow.

## Organización del código de pruebas

- Unit tests: `tests/unit/**` (usar TypeScript)
- E2E tests: `tests/e2e/**` o `tests/playwright/**` (usar POM para locators en `tests/pages/` y separar las acciones en `tests/actions/`)
- Mocks y utilidades de pruebas compartidas: `tests/utils/` o `tests/e2e/helpers/`

## Patrones y buenas prácticas

- Unit
  - Nombres de test descriptivos: `describe('módulo') / it('debe devolver X cuando Y')`
  - AAA: Arrange / Act / Assert
  - Mockear dependencias externas con `vi.mock()` y usar `vi.resetModules()` cuando importes módulos dinámicamente
  - Evitar `any`; preferir datos fuertemente tipados y factories para crear fixtures

 - E2E
  - Page Object Model (POM) con una restricción importante: los Page Objects deben *exponer únicamente* `Locator`s y selectores, **no** contener acciones complejas.
    - Responsabilidad de los `pages/*`: ofrecer locators y helpers de acceso (p. ej. `loginForm.username()` devuelve `Locator`) ubicados en `tests/e2e/pages/`.
    - Para operaciones muy simples es perfectamente válido usar directamente los locators en los tests (p. ej. `page.locator('[data-e2e=btn]').click()` o `somePage.elLocator().fill('valor')`).
    - Las `actions` ubicadas en `tests/actions/` se recomiendan solo cuando hay composiciones reutilizables o flujos complejos: por ejemplo, cuando una secuencia genera un código, maneja iframes, activa callbacks externos o coordina pasos que no se resuelven con una sola llamada a un locator. En esos casos, las `actions` encapsulan la lógica y mantienen los tests legibles.
      - Preferible: definir las operaciones relacionadas en el `Page` (por ejemplo `loginPage.login()` que use los locators) y envolver su ejecución en `test.step` desde el test. De este modo el Page mantiene locators y helpers cohesivos, y `test.step` agrupa esas operaciones en el reporte del runner como un bloque expandible. Ejemplo:

  ```ts
  // tests/e2e/pages/ContentPage.ts
  import { Page, Locator } from '@playwright/test'
  // Page objects deben exponer solo locators
  export class ContentPage {
    constructor(private page: Page) {}
    main(): Locator { return this.page.locator('main') }
    header(): Locator { return this.page.locator('header') }
    // no incluir acciones/composiciones aquí
  }
  ```

  ```ts
  // tests/e2e/a11y.spec.ts
  import { test } from '@playwright/test'
  import { ContentPage } from '@tests/e2e/pages/ContentPage'
  import { checkA11y } from '@tests/actions/A11yActions'

  test('page is accessible', async ({ page }) => {
    const content = new ContentPage(page)
    await page.goto('/some-path')
    await test.step('Run accessibility checks', async () => {
      // `checkA11y` encapsula el builder y ya usa `test.step` internamente
      await checkA11y()({ page })
    })
  })
  ```
  - Beneficios: mantiene la separación entre estructura del DOM (Pages) y comportamiento (Tasks/Interactions), mejora la reutilización y facilita cambios en el DOM sin mover la lógica de negocio de los tests.
  - Localizadores estables: preferir selectores accesibles soportados por Playwright (p. ej. `getByRole` / selectores ARIA). Si no es práctico, usar `data-testid` como atributo estable. Evitar selectores frágiles (clases que cambian)
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
    - `unit-tests`: runs on push/PR (no en `workflow_dispatch`), ejecuta `vitest --run --coverage` y sube `coverage/` como artifact
    - `e2e-tests`: ejecuta Playwright; habilitado también para `workflow_dispatch` para ejecutar E2E contra cualquier `base_url` (input del workflow)

  - Rationale: las ejecuciones manuales (`workflow_dispatch`) suelen querer validar un entorno/preview con E2E; evitar ejecutar unitarias en ese caso para ahorrar tiempo y enfocarse en el objetivo manual.

## Cobertura

- Solo el job `unit-tests` genera cobertura (`lcov.info`) y la sube como artifact `vitest-coverage`.
- Recomendación: si se integra un servicio de cobertura (Codecov/Coveralls), subir `coverage/lcov.info` desde el job `unit-tests`.

## Migración y consolidación (pasos operativos)

1. Mantener ambos runners localmente (`Cypress` y `Playwright`) solo hasta que se verifique la paridad
2. Eliminar scripts y configuraciones de Cypress cuando se confirme que Playwright cubre los casos necesarios
3. Unificar el comando `npm run test` si decides mantener un único runner: por ejemplo `test` -> `npm run test:e2e` o usar subcomandos claros (`test:unit`, `test:e2e`)

## Ejemplos rápidos

- Mockear módulo en Vitest:

```ts
vi.mock('@github/lib/some', () => ({ fn: vi.fn() }))
```

- Pagina POM (Playwright):

```ts
// tests/e2e/pages/LoginPage.ts
import { Page, Locator } from '@playwright/test'
export class LoginPage {
  constructor(private page: Page) {}
  username(): Locator { return this.page.locator('[data-e2e=username]') }
  password(): Locator { return this.page.locator('[data-e2e=password]') }
  submit(): Locator { return this.page.locator('[data-e2e=submit]') }
}
```

Ejemplo de Action (ilustrativo). Nota: si la página es estática y la interacción es simple, no hace falta `action` — usa el locator directamente en el test.

```ts
// tests/actions/loginAction.ts (ilustrativo)
import { test } from '@playwright/test'
import type { LoginPage } from '@tests/e2e/pages/LoginPage'

export async function loginAction(loginPage: LoginPage, user: string, pass: string) {
  return test.step('Login', async () => {
    await loginPage.username().fill(user)
    await loginPage.password().fill(pass)
    await loginPage.submit().click()
  })
}
```

Ver ejemplo adicional en `tests/actions/A11yActions.ts` para ver el patrón de `actions` aplicado a comprobaciones de accesibilidad.

## Recomendaciones finales

- Mantén las suites unitarias veloces y confiables; reserva E2E para flujos reales.
- Documenta cualquier test E2E flakey y aisla su ejecución (tag/grep) para no romper CI constantemente.
- Revisa periódicamente el tamaño de la suite E2E y prioriza rutas críticas.

Si quieres, puedo:

- Añadir plantillas de archivos para `tests/pages/` (POM) y `tests/unit` (estructura mínima), o
- Añadir el paso de subida de `lcov.info` a Codecov en el job `unit-tests`.

*** Fin del documento
