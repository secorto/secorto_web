---
title: ADR 012: Implementación de POM por capas (Given/When/Then)
status: proposed
date: 2026-05-30
categories:
  - Testing
  - Architecture
---

## Contexto

Actualmente los page objects del proyecto exponen `Locator`s.
Se plantea una implementación nueva por capas basada en pasos (`Given/When/Then`, `Act`, `Verify`) que
expone operaciones de alto nivel desde los page objects para reducir la fricción en los tests.

## Decisión

Adoptar un POM por capas donde:

- Los fixtures Gherkin (`tests/fixtures/gherkin.ts`) orquestan pasos (Given/When/Then/Act/Verify).
- Los page objects exponen acciones y verificaciones de alto nivel (no `Locator`s) salvo excepción justificada.
- Mantener un barrel mínimo (`tests/fixtures/index.ts`) que re-exporte únicamente los helpers centrales.

## Consecuencias

- Positivas: tests más legibles y menos acoplados al DOM; cambios en la UI requieren menos cambios en tests.
- Negativas: coste de implementación; riesgo de sobrecargar los page objects si no se controla la abstracción.

## Implementación (resumen)

1. Normalizar exports con `tests/fixtures/index.ts` (ya añadido).
2. Implementar los page objects críticos (`HomePage`, `SidebarPage`) según la nueva API de pasos.
3. Implementación desde cero: no se asume una "migración" incremental universal; cuando sea necesario
   se crearán adaptadores para mantener pruebas existentes funcionando durante la transición.
4. Añadir pruebas para pasos compartidos y documentar convenciones (niveles de abstracción).

## Referencias

- `tests/fixtures/gherkin.ts`
- `tests/fixtures/index.ts`
- `tests/pages/HomePage.ts`
