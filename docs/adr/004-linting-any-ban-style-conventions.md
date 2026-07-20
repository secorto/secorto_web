---
title: ADR 004 - Linting, tipo `any` y convenciones de estilo
status: superseded
date: 2026-02-15
last_updated: 2026-07-20
categories:
  - Tooling
  - Code Quality
  - Style
superseded_by:
  - 013
---

## Contexto

El proyecto experimentaba problemas recurrentes de calidad de código:

1. **Uso extendido de `any`:** incapacidad de TypeScript para detectar
   errores en tiempo de compilación.
2. **Falta de linting centralizado:** convenciones inconsistentes entre
   archivos.
3. **Inconsistencia de estilo:** falta de convención unificada para
   semicolons, indentación y formato.

## Decisión

1. **Prohibir `any` explícitamente** en el código fuente mediante linting
2. **Centralizar y estructurar ESLint** para validación uniforme
3. **Definir convenciones de estilo** (formatting, semicolons, indentación)

### Razonamiento

- **Type safety:** detectar errores en compilación, no en runtime
- **Consistency:** código uniforme facilita mantenimiento y colaboración
- **Automation:** linting como primera línea de defensa contra regresiones
- **Tooling alignment:** Copilot y generadores de código siguen las mismas
  convenciones

## Consecuencias

### Positivas

- TypeScript detecta errores de tipo antes de compilación
- Código uniforme en todo el proyecto
- Fácil de aplicar automáticamente en CI/CD
- Previene deuda técnica por code drift

### Consideraciones

- Requiere actualización de código existente con `any`
- Configuración inicial de ESLint puede ser compleja
- Reglas de estilo son subjetivas y pueden generar fricción

## Referencias

Para detalles técnicos, configuración específica de ESLint, tabla de
refactoings de `any`, y ejemplos de patrones:
ver [anexos/004-linting-any-ban/CONFIGURATION_AND_REFACTORING.md](../anexos/004-linting-any-ban/CONFIGURATION_AND_REFACTORING.md)

- [ADR 013: Actualización a ESLint 10](./013-lint-rule-changes.md) — decisión posterior que refina/actualiza esta
- [ADR 012: Formato y convenciones de estilo](./012-formatting-proposal.md)
- [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files-new)
