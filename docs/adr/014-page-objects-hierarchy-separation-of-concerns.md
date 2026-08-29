---
id: ADR-014
title: Jerarquía de Page Objects con separación clara de responsabilidades
status: accepted
date: 2026-07-20
last_updated: 2026-08-29
categories:
  - Testing
  - Architecture
---
## Contexto

La arquitectura E2E del proyecto presentaba una mezcla de responsabilidades dentro de los Page Objects,
dificultando la mantenibilidad, la claridad semántica y la escalabilidad.
Una clase actuaba simultáneamente como vista de lista, vista de detalle y vista filtrada,
violando el principio de responsabilidad única.

Esto generaba:

- Confusión en los tests: el tipo de retorno no comunicaba el contexto.
- Duplicación de métodos y selectores.
- Contaminación de la clase base.
- Dificultad para agregar nuevas especializaciones.

## Decisión

Se adopta una jerarquía de Page Objects basada en **especialización por contexto**,
con una **base mínima** y **componentes reutilizables**.
Cada clase representa una vista específica y expone únicamente los métodos relevantes para ese contexto.

### Estructura general

- **Base compartida**: layout, encabezado, navegación global.
- **Vista de Lista**: navegación de items, filtrado, validaciones de listado.
- **Vista de Detalle**: validaciones de contenido específico.
- **Vista Filtrada**: validaciones de resultados filtrados.

Los tests deben expresar intención mediante el tipo de retorno del Page Object.

## Motivación

- Seguridad de tipos.
- Claridad semántica.
- Escalabilidad.
- Mantenibilidad.
- Legibilidad.

## Alternativas consideradas

1. Clase genérica única — rechazada.
2. Mega-interfaz — rechazada.
3. Mixins — innecesarios.

## Consecuencias

### Positivas

- Separación clara de responsabilidades.
- Autocompletar más preciso.
- Mantenibilidad mejorada.
- Escalabilidad del modelo.

### Negativas

- Mayor número de clases.
- Necesidad de actualizar factories y helpers.

## Referencias

- [PAGE_OBJECTS.md](../architecture/PAGE_OBJECTS.md) — Arquitectura completa de POM
- [TESTING_STRATEGY.md](../architecture/TESTING_STRATEGY.md) — Estrategia de pruebas
