---
id: ADR-015
title: Consolidación de aserciones E2E mediante soft expect semánticamente guiado
status: accepted
date: 2026-07-20
last_updated: 2026-08-29
categories:
  - Testing
  - E2E
---

## Contexto

La suite E2E del proyecto genera **excesiva combinatoria** cuando múltiples verificaciones
independientes se fragmentan en tests separados:

- Una página con 5-6 validaciones genera **N tests × M locales = N×M navegaciones de
  browser**
- Presión en CI: instanciación simultánea causa flakiness y timeouts en GitHub Actions
- Suite crece a 50-70 test names sin valor semántico incrementado

**Problema raíz:** Confundir "atomicidad de assertion" (una responsabilidad = varios
expects) con "atomicidad de test case" (cada expect en un test separado).

## Objetivo

Definir un patrón que respete límites semánticos reales: **un acto de usuario =
múltiples verificaciones independientes en un solo test**.

## Decisión

Consolidar verificaciones independientes sobre el mismo estado usando **soft expect**,
asegurando que:

1. **Todas** las validaciones se ejecuten (sin early exit)
2. Aparezcan como steps independientes etiquetados en el reporte
3. Cambios de implementación permanezcan en POM, no en tests

**Criterio:**

- ✅ **Consolidable:** múltiples expects sin interacción intermedia
- ❌ **No consolidable:** action → assert → action → assert (hay cambio de estado)

## Motivación

| Aspecto | Antes | Después | Beneficio |
| --- | --- | --- | --- |
| Instanciaciones | 3×2×3 = 18 | 1×2×3 = 6 | 66% |
| Diagnosticidad | 1 fallo → re-run | Soft asserts = todas las faltas | Menos re-runs |
| Suite size | 50-70 tests | 15-20 tests | Limpio |
| Separación | Test = detalles | Test = intención | Mantenible |

## Consecuencias

### Positivas

- CI time: 40-60% reducción medida en tags y homepage
- Diagnosticidad: soft asserts permiten ver múltiples faltas sin re-run
- POM encapsulation: selectors/lógica se cambian en un lugar
- Suite clarity: test names expresan actos, no checklists

### A considerar

- Requiere disciplina: no consolidar indiscriminadamente (ver criterio arriba)
- Nuevo contribuidor debe entender límites semánticos
- Mitigación: ver [E2E_CONSOLIDATION.md](./anexos/015-consolidated-e2e-assertions-soft-expect/E2E_CONSOLIDATION.md)
  con contraejemplos

## Referencias

- [TESTING_STRATEGY.md](../architecture/TESTING_STRATEGY.md) — Estrategia de pruebas

## Anexos

- [E2E_CONSOLIDATION.md](./anexos/015-consolidated-e2e-assertions-soft-expect/E2E_CONSOLIDATION.md) — Guía técnica de implementación
