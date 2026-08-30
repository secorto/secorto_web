# Estrategia de Pruebas

Este documento explica el enfoque de testing en este repositorio:
análisis estático (primera línea de defensa) + pruebas unitarias y E2E (pruebas dinámicas).
Incluye elección de frameworks, patrones recomendados y cómo ejecutar cada tipo localmente y en CI.

## ¿Por dónde empiezo?

- **Escribir test E2E (Playwright)** → Sigue leyendo, luego ve a [PAGE_OBJECTS.md](PAGE_OBJECTS.md)
  para patrón de Page Object Model
- **Escribir test unitario (Vitest)** → Sigue leyendo sección "Pruebas Unitarias"
- **Entender por qué estos frameworks** → [ADR 002 — Testing Framework Migration](../adr/002-dynamic-testing-architecture.md)
- **Usar soft assertions en E2E** → [ADR 015 — Consolidated E2E Assertions](../adr/015-consolidated-e2e-assertions-soft-expect.md)
- **Reglas de estilo** → [CODING_GUIDELINES.md](../CODING_GUIDELINES.md)

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
[ADR 002](../adr/002-dynamic-testing-architecture.md).

## Análisis Estático: Primera Línea de Defensa

Antes de ejecutar pruebas dinámicas, validación estática asegura contractos explícitos
y previene categorías de errores que serían costosas en tests:

- **TypeScript strict**: Tipos en `domain/`, componentes, utils. Sin `any` sin justificación.
- **ESLint**: Reglas de estilo + convenciones (ver [ADR 004](../adr/004-linting.md))
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
- **Evitar `any`**: Preferir datos fuertemente tipados (ver [ADR 004](../adr/004-linting.md))
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
- **Estructura**: Usa el modelo de 3 capas composables (Components, Pages, Flows)
- **Detalles**: Ver [PAGE_OBJECTS.md](PAGE_OBJECTS.md) para la arquitectura completa, patrones e ilustraciones

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
- **Consulta [E2E_CONSOLIDATION.md](E2E_CONSOLIDATION.md)** para el patrón de consolidación de aserciones con soft expect.
- **No sobre-ingenierices**: Usa componentes simples cuando aplique.
  Si un flow es single-step, hazlo inline en el spec.
