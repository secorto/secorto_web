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

- **Unit tests**: `tests/unit/**` (usar TypeScript)
- **E2E tests**: `tests/e2e/**` con estructura en capas (ver sección "Modelo Component/Page/Flow")
  - Componentes: `tests/support/ui/components/`
  - Pages por dominio: `tests/support/ui/{domain}/`, `tests/support/ui/home/`, `tests/support/ui/sidebar/`, etc.
  - Flows (secuencias multi-step/multi-page): `tests/support/flows/`
  - Helpers y mocks: `tests/e2e/helpers/`, `tests/support/ui/shared/`
- **Mocks y utilidades compartidas**: `tests/utils/` para unit, `tests/e2e/helpers/` y `tests/support/ui/` para E2E

## Modelo Component/Page/Flow (E2E)

La arquitectura E2E en este proyecto sigue un modelo de 3 capas composables:

### Capa 1: Components (Unidades de UI con Comportamiento)
**Ubicación**: `tests/support/ui/components/`

Abstraen cualquier unidad de UI con un protocolo de interacción o validación esperado:
- **Primitivos**: `Target` (locator genérico + assertions), `Link` (locator + validaciones de href)
- **Especializados**: `Comments` (composite: script + iframe), `PageHelper` (utilidades stateless)
- **Criterio de creación**: ¿Tiene el elemento un "happy path" o protocolo de uso? → Es componente
- **Responsabilidad**: Encapsular cómo se ve/comporta EL ELEMENTO específico (no el contexto page)
- **Patrón**: Clase + factory + métodos que retornan `Promise` vía `step()`
- **Realidad SSG**: En un sitio sin interacciones pesadas, `Target` suele ser suficiente. Pero si existe un Dropdown, Modal, o Tab con open/close/select, ese es un componente formal

### Capa 2: Pages (Orquestadores de Components)
**Ubicación**: `tests/support/ui/{domain}/` (ej: `home/`, `content/`, `sidebar/`)

Orquestan múltiples components con métodos semánticos que representan el flujo local:
- **Responsabilidad**: Combinar components para expresar la lógica/validación de una sección
- **Patrón**: 
  - Clase con constructor que inyecta components
  - Factory: `homePage(page: Page): HomePage`
  - Helper: `userInHome(page: Page): Promise<HomePage>` que invoca `visit()` y retorna factory
  - Métodos sin `async` si retornan lazy `Promise` (para encadenamiento)
- **Métodos**: Cada uno encapsulado en `step()`, orquestan 1+ componentes + lógica local
- **Ejemplo**: `ContentListPage` inyecta `TargetSelector<string>` (items), `TargetSelector<string>` (tags), `Comments` → expone `filterByTag()`, `clickItem()`, `shouldHaveComments()`

### Capa 3: Flows (Secuencias Multi-Step/Multi-Page - OPCIONAL)
**Ubicación**: `tests/support/flows/` (funciones reutilizables) + `tests/e2e/flow/` (specs)

Encapsulan narrativas complejas que cruzan múltiples pages o requieren coordinación:
- **Responsabilidad**: Encapsular secuencias que no pertenecen a una sola page
- **Ejemplo**: "navegar blog → filtrar tag → click post → validar detalle" = flujo (es la narrativa)
- **Patrón**: Función que recibe `Page` y parámetros, retorna último page accedido para chaining
- **Internamente**: Cada acción wrapped en `step()`, usa múltiples pages
- **Cuándo**: Solo para flujos complejos multi-step/multi-page. No sobre-ingenierizar.

**Ejemplo mínimo**:
```typescript
// tests/support/flows/blog.flow.ts
export const navigateBlogFilterAndDetail = async (
  page: Page,
  locale: UILanguages,
  tag: string,
  slug: string,
) => {
  const list = await userInBlogList(page, locale)
  await step(`filter by "${tag}"`, async () => {
    await list.filterByTag(tag)
  })
  const path = contentDetailsPath('blog', locale, slug)
  await step(`navigate to detail`, async () => {
    await list.clickItem(path, `click "${slug}"`)
  })
  return list // retorna último page para assertions en test
}
```

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
  - **Componentes vs Pages**: Components encapsulan comportamiento de elementos aislados (Target, Dropdown, Comments).
    Pages combinan components para expresar lógica de sección/dominio. Pages exponen métodos semánticos, NO simples locators.
  - **Encapsulación en `step()`**: Cada método en components y pages debe retornar `Promise` via `step()` para visibilidad en reportes E2E.
  - **Inyección de componentes**: Pages reciben components en constructor, no los crean directamente.
  - **Flows (cuando sea necesario)**: Usa flows para secuencias complejas multi-page; no para toda acción.
  - **Localizadores estables**: Preferir selectores accesibles por Playwright (`getByRole` / ARIA).
    Si no es práctico, usar `data-testid` como atributo estable. Evitar selectores frágiles (clases).
  - **Mocking de terceros**: Mockear recursos externos con `page.route()` o proveedores locales en CI.
  - **Timeouts razonables**: Usar checks de visibilidad/atributos en lugar de `sleep()`

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

Consulta los ejemplos concretos en el repositorio, organizados por capa:

**Components** (primitivos y especializados):
- `tests/support/ui/components/Target.ts` — component primitivo con assertions
- `tests/support/ui/components/Link.ts` — component que extiende Target
- `tests/support/ui/content/Comments.ts` — component composite (script + iframe)

**Pages** (por dominio):
- `tests/support/ui/home/HomePage.ts` — page simple
- `tests/support/ui/content/ContentListPage.ts` — page compleja con TargetSelector dinámico
- `tests/support/ui/content/BlogPages.ts` — helper exports con `visit()` (ej: `userInBlogList`)

**Flows** (secuencias):
- `tests/e2e/flow/blog.flow.spec.ts` — flujo de navegación single-locale (lista → filtro → detalle)
- `tests/e2e/flow/work.flow.spec.ts`, `tests/e2e/flow/community.flow.spec.ts` — flujos similares por sección
- `tests/e2e/helpers/mockGiscus.ts` — helpers/mocks compartidos
- `tests/e2e/functional/blog.post.spec.ts`, `tests/e2e/a11y/charla.a11y.spec.ts` — specs funcionales

**Tests unitarios**:
- `tests/unit/i18n/utils.test.ts`, `tests/unit/client/themeToggle.test.ts` — ejemplos con mocks

## Recomendaciones finales

- **Mantén las suites unitarias veloces y confiables**; reserva E2E para flujos reales.
- **Documenta cualquier test E2E flakey** y aísla su ejecución (tag/grep) para no romper CI.
- **Revisa periódicamente** el tamaño de la suite E2E y prioriza rutas críticas.
- **No sobre-ingenierices**: Si un componente simple resuelve el need, usa Target. Si un flow es single-step, hazlo inline en el spec.
- **Composición sobre herencia**: Prefiere inyectar components en pages que crear jerarquías de herencia.
