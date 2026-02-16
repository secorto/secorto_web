# Technical Debt Tracker

Este archivo centraliza las excepciones temporales y deuda técnica marcada en el
repositorio. No se crean issues por cada excepción: los comentarios inline
(`TODO(debt): ...`) en el código sirven como referencia y deben reflejarse
en esta lista cuando requieren seguimiento.

Formato de entrada
- **id**: identificador corto (p. ej. `debt-001`)
- **archivo**: ruta al archivo donde aparece
- **línea / contexto**: resumen breve del lugar
- **razón**: por qué se aceptó la excepción temporal
- **owner**: responsable temporal (@usuario)
- **until**: fecha objetivo para revisar
- **estado**: `open` | `in-progress` | `closed`

Ejemplo

- id: debt-001
  archivo: `cypress/e2e/stubs.ts`
  línea / contexto: `onBeforeLoad` stub de `matchMedia`
  razón: Test legacy depende de Cypress; plan de migración a Playwright en curso
  owner: @scot3004
  until: 2026-05-01
  estado: open

Cómo usar
1. Añadir el comentario inline en el código con el formato:

```ts
// TODO(debt): <razón breve> — owner: @usuario — until: YYYY-MM-DD
```

2. Añadir o actualizar la entrada correspondiente en este archivo con detalles
   adicionales si el ítem requiere seguimiento.

3. En la revisión de sprint o cada mes, revisar las entradas `open` y moverlas
   a `in-progress` o `closed` según corresponda.

Notas
- Este archivo es la fuente de verdad para deuda técnica. Evitar crear issues
  por cada excepción para mantener el backlog limpio.
