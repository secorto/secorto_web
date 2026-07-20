# Estrategia de Pruebas

Este documento explica el enfoque de testing en este repositorio:
análisis estático (primera línea de defensa) + pruebas unitarias y E2E (pruebas dinámicas).
Incluye elección de frameworks, patrones recomendados y cómo ejecutar cada tipo localmente y en CI.

## Principios Generales

**Tres capas de validación**:

1. **Análisis Estático** (primera línea de defensa): TypeScript, ESLint, Markdownlint, build-time validation.
   Previene errores a costo cero de ejecución.
2. **Pruebas Unitarias (Vitest)**: Verificar lógica de unidades aisladas (funciones, módulos, clases).
   Rápidas, determinísticas, sin red ni FS real.
3. **Pruebas E2E (Playwright)**: Validar flujos de usuario e integración en entornos reales o preview.

**En CI**: Ejecutar las 3 capas en orden (lint → unit-tests → e2e-tests). Almacenar cobertura (solo unit) y reportes E2E.

## Elección de frameworks

- Unit — `Vitest`
- E2E — `Playwright`

Para el razonamiento y la justificación de cada elección, ver
[ADR 002](../adr/002-testing-framework-migration.md).

## Análisis Estático: Primera Línea de Defensa

Antes de ejecutar pruebas dinámicas, validación estática asegura contractos explícitos
y previene categorías de errores que serían costosas en tests:

- **TypeScript strict**: Tipos en `domain/`, componentes, utils. Sin `any` sin justificación.
- **ESLint**: Reglas de estilo + convenciones (ver [ADR 004](../adr/004-linting-any-ban-style-conventions.md) y [ADR 013](../adr/013-lint-rule-changes.md))
- **Markdownlint**: Documentación consistente (ver [MARKDOWN_VALIDATION.md](../MARKDOWN_VALIDATION.md))
- **Build-time validation**: Astro valida `src/content.config.ts`, `i18n`, rutas dinámicas

**Ejecución**:

- Local: `npm run lint` (TypeScript + ESLint + Markdownlint)
- CI: Job `lint` ejecuta antes de unit/E2E

---

## Comparativa: Unit vs E2E

| Aspecto | Unit (Vitest) | E2E (Playwright) |
| --- | --- | --- |
| **Ubicación** | `tests/unit/` | `tests/e2e/` + capas en `tests/support/` |
| **Arquitectura** | Simple: `describe` + `it` | Component/Page/Flow (3 capas) |
| **Objetivo** | Lógica aislada (funciones, módulos) | Flujos de usuario integrados |
| **Velocidad** | <50ms por test | Más lentos (requieren browser) |
| **Cobertura** | ✅ Sí (lcov reportado) | ❌ No (comportamiento, no líneas) |
| **Mocking** | Mocks de dependencias | Mockear terceros, API calls |

---

## Patrones y Buenas Prácticas Transversales

Aplican a **Unit** y **E2E**:

- **Nombres descriptivos**: `describe('contexto') / it('debe X cuando Y')`
- **AAA**: Arrange / Act / Assert
- **Evitar `any`**: Preferir datos fuertemente tipados (ver [ADR 004](../adr/004-linting-any-ban-style-conventions.md))
- **Mockear dependencias externas**: Aislar el código bajo prueba de terceros

---

## Pruebas Unitarias (Vitest)

### Objetivos (Unit)

- Verificar la lógica de unidades aisladas: reglas de negocio, transformaciones, utilidades,
  componentes puros (sin renderizado complejo de UI).
- Rápidas (<50ms por test), independientes, determinísticas.
- Generar cobertura (`lcov`) para artifact `vitest-coverage` en CI.

### Organización (Unit)

- **Ubicación**: `tests/unit/**` (usar TypeScript)
- **Estructura**: Simple. Describe bloques + tests individuales. Sin arquitectura de capas.
- **Utilities**: `tests/utils/` para factories, helpers, mocks compartidos

### Patrones Específicos: Unit

- Usar `vi.mock()` y `vi.resetModules()` cuando importes módulos dinámicamente
- Preferir pruebas sociables: probar módulos con dependencias reales y mocks mínimos,
  para evitar el coste y la fragilidad de mocks que no aportan valor
- Factories para crear fixtures fuertemente tipadas

### Convenciones de Ejecución (Unit)

**Local**:

- Watch: `npm run test:unit` (o `vitest --watch`)
- UI: `npm run test:unit:ui` (`vitest --ui`)

**CI**:

- Ejecuta: `vitest --run --coverage`
- Genera artifact `vitest-coverage` con lcov.info
- Runs on: push/PR (no en `workflow_dispatch`)

## Pruebas E2E (Playwright)

### Objetivos (E2E)

- Validar flujos de usuario e integración entre componentes en entornos reales o preview.
- Verificar rutas críticas: publicación, navegación, interacciones clave.
- Mockear terceros (analytics, widgets) para evitar flakiness; probar integraciones reales solo en preview.

### Organización (E2E)

- **Ubicación**: `tests/e2e/**` + soporte en capas
- **Estructura en capas** (ver sección "Modelo Component/Page/Flow"):
  - Componentes: `tests/support/ui/components/`
  - Pages por dominio: `tests/support/ui/{domain}/`, `tests/support/ui/home/`, `tests/support/ui/sidebar/`, etc.
  - Flows (opcional): `tests/support/flows/`
  - Helpers y mocks: `tests/e2e/helpers/`, `tests/support/ui/shared/`

### Modelo Component/Page/Flow (Arquitectura en Capas)

La arquitectura E2E en este proyecto sigue un modelo de 3 capas composables:

#### Capa 1: Components (Unidades de UI con Comportamiento)

**Ubicación**: `tests/support/ui/components/`

Abstraen cualquier unidad de UI con un protocolo de interacción o validación esperado:

- **Primitivos**: `Target` (locator genérico + assertions), `Link` (locator + validaciones de href)
- **Especializados**: `Comments` (composite: script + iframe), `PageHelper` (utilidades stateless)
- **Criterio de creación**: ¿Tiene el elemento un "happy path" o protocolo de uso? → Es componente
- **Responsabilidad**: Encapsular cómo se ve/comporta EL ELEMENTO específico (no el contexto page)
- **Patrón**: Clase + factory + métodos que retornan `Promise` vía `step()`
- **Realidad SSG**: En un sitio sin interacciones pesadas, `Target` suele ser
  suficiente. Pero si existe un Dropdown, Modal, o Tab con open/close/select,
  ese es un componente formal

#### Capa 2: Pages (Orquestadores de Components)

**Ubicación**: `tests/support/ui/{domain}/` (ej: `home/`, `content/`, `sidebar/`)

Orquestan múltiples components con métodos semánticos que representan el flujo local:

- **Responsabilidad**: Combinar components para expresar la lógica/validación de una sección
- **Patrón**:
  - Clase con constructor que inyecta components
  - Factory: `homePage(page: Page): HomePage`
  - Helper: `userInHome(page: Page): Promise<HomePage>` que invoca `visit()` y retorna factory
  - Métodos sin `async` si retornan lazy `Promise` (para encadenamiento)
- **Métodos**: Cada uno encapsulado en `step()`, orquestan 1+ componentes + lógica local
- **Ejemplo**: `ContentListPage` inyecta múltiples `TargetSelector<string>`,
  `Comments` → expone métodos semánticos (`filterByTag`, `clickItem`, etc.)

#### Capa 3: Flows (Secuencias Multi-Step/Multi-Page - OPCIONAL)

**Ubicación**: `tests/support/flows/`

Encapsulan narrativas complejas que cruzan múltiples pages o requieren coordinación:

- **Responsabilidad**: Encapsular secuencias que no pertenecen a una sola page
- **Por qué**: Permite reutilizar narrativas complejas en múltiples tests sin duplicación
  (ej: "iniciar sesión → navegar → filtrar → validar").
- **Cuándo**: Solo cuando necesites la **misma secuencia multi-page en múltiples tests**.
  Si es una secuencia única, hazla inline en el spec.
- **Estructura**: UN único `step()` raíz; cada acción delega a métodos de Page que contienen sus propios `step()`

### Patrones Específicos (E2E)

- **Componentes vs Pages**: Components encapsulan comportamiento de elementos aislados
  (Target, Dropdown, Comments). Pages combinan components para expresar lógica de sección/dominio.
  Pages exponen métodos semánticos, NO simples locators.
- **Encapsulación en `step()`**: Cada método retorna `Promise` via `step()` para visibilidad en reportes E2E.
- **Inyección de componentes**: Pages reciben components en constructor, no los crean directamente.
- **Flows (cuando sea necesario)**: Usa flows para secuencias complejas multi-page; no para toda acción.
- **Localizadores estables**: Preferir selectores accesibles por Playwright (`getByRole` / ARIA).
  Si no es práctico, usar `data-testid` como atributo estable. Evitar selectores frágiles (clases).
- **Mocking de terceros**: Mockear recursos externos con `page.route()` o proveedores locales en CI.
- **Timeouts razonables**: Usar checks de visibilidad/atributos en lugar de `sleep()`

### Convenciones de Ejecución (E2E)

**Local**:

- `npm run test:e2e` (ejecuta `npx playwright test`; agregar `--headed` para depuración)

**CI**:

- Ejecuta: `npx playwright test`
- También en `workflow_dispatch` para ejecutar E2E contra cualquier `base_url` (input del workflow)

---

## Orden de Ejecución en CI

Workflow `Tests` (archivo `.github/workflows/tests.yml`) ejecuta en el siguiente orden:

1. **`lint` job**: TypeScript + ESLint + Markdownlint (falla rápido)
2. **`unit-tests` job**: Vitest con cobertura
3. **`e2e-tests` job**: Playwright (en paralelo a unit-tests)

## Cobertura

- Solo `unit-tests` genera cobertura (`lcov.info`) y la sube como artifact `vitest-coverage`.
- E2E no reporta cobertura (valida comportamiento integrado, no cobertura de línea).

---

## Recomendaciones finales

- **Mantén las suites unitarias veloces y confiables**; reserva E2E para flujos reales.
- **Documenta cualquier test E2E flakey** y aísla su ejecución (tag/grep) para no romper CI.
- **Revisa periódicamente** el tamaño de la suite E2E y prioriza rutas críticas.
- **No sobre-ingenierices**: Usa componentes simples cuando aplique.
  Si un flow es single-step, hazlo inline en el spec.
- **Composición sobre herencia**: Prefiere inyectar components en pages que crear jerarquías de herencia.
