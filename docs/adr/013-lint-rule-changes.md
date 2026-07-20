---
title: ADR 013 - Actualización a ESLint 10 y eliminación temporal de plugins
status: accepted
date: 2026-05-21
categories:
  - Tooling
  - Code Quality
---

## Contexto

Algunos plugins de linting tienen versiones desactualizadas con actualizaciones
pendientes en repositorios upstream, bloqueando la migración del core de linting
a una versión más reciente. Esto crea un trade-off:

- **Opción A:** Esperar a que todos los plugins se actualicen (incierto, tiempo
  indeterminado).
- **Opción B:** Priorizar la actualización del core, removiendo temporalmente
  los plugins desactualizados hasta que existan versiones compatibles o
  alternativas.

Se eligó la opción B porque:
- La actualización del core ofrece beneficios transversales (seguridad,
  compatibilidad, rendimiento).
- El valor de ciertos plugins es redundante con otras herramientas del proyecto
  (type checking, tests E2E).
- Mantener el core actualizado reduce deuda técnica a largo plazo.

## Decisión

**Priorizar la actualización del core de linting** sobre mantener plugins
desactualizados, removiendo temporalmente aquellos que bloqueen la
migración.

### Características clave

- Eliminar dependencias desactualizadas que bloquean la actualización del core.
- La eliminación es **temporal y reversible** (no permanente).
- Mitigar la pérdida de funcionalidad con:
  - Herramientas alternativas existentes (type checkers, test frameworks).
  - Revisiones manuales en áreas críticas (accesibilidad, imports).
  - Reglas nativas del core actualizado.
- Documentar criterios claros para **reincorporar plugins** en el futuro.

---

## Alternativas consideradas

- **Mantener plugins desactualizados indefinidamente:** rechazado por acumular
  deuda técnica y bloquear mejoras del core.
- **Esperar pasivamente a que se actualicen:** rechazado por incertidumbre y
  riesgo de estancamiento.
- **Usar alternativas de plugins diferentes:** considerado si existen, pero
  preferentemente eliminación temporal.

---

## Consecuencias

### Positivas

- Desbloqueada la actualización del core: beneficios transversales (seguridad,
  compatibilidad, rendimiento).
- Reducida complejidad operativa: menos dependencias desactualizadas.
- Establece precedente: core siempre actualizado, plugins secundarios se
  reincorporan solo si añaden valor neto.

### Consideraciones

- Pérdida temporal de reglas automatizadas en áreas específicas (imports,
  accesibilidad).
- Requiere compensación mediante herramientas alternativas (type checking,
  tests E2E, revisiones manuales).
- Mayor disciplina en revisin de código en áreas antes automatizadas.

---

## Mitigaciones propuestas

- Usar type checking nativo (TypeScript) para validación de imports.
- Mantener tests E2E y validaciones de accesibilidad en tests críticos.
- Priorizar revisiones manuales en componentes y configuración hasta
  reincorporar reglas.
- Documentar el estado y criterios de reincorporación (ver «Criterios para
  reincorporar plugins» abajo).

---

## Criterios para reincorporar plugins

- El plugin ofrece versión compatible y estable con la versión actual del
  core.
- La reincorporación no introduce cambios incompatibles.
- El valor neto (reglas útiles - costo de mantenimiento) es positivo.

## Referencias y detalles de implementación

Para detalles operativos de la migración, scripts de CI, configuración y
validación: ver documentación de arquitectura y archivos de configuración del
proyecto.

### Relación con otros ADRs

Este cambio complementa y aclara decisiones de [ADR 004 - Linting, tipo `any` y
convenciones de estilo](004-linting-any-ban-style-conventions.md) y se
coordiná con:

- [ADR 012 - Formateo y herramienta de estilo propuesta](012-formatting-proposal.md)
