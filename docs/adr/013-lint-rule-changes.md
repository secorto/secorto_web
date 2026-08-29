---
id: ADR-013
title: Migración a ESLint 10 y suspensión temporal de plugins bloqueantes
status: accepted
date: 2026-05-21
categories:
  - Tooling
  - Code Quality
---

## Contexto

La actualización del core de ESLint a la versión 10 estaba bloqueada por la falta de compatibilidad de dos plugins externos:

- `eslint-plugin-import`
- `eslint-plugin-jsx-a11y`

Ambos mantenían PRs abiertos desde febrero de 2026 sin señales claras de resolución.
Esto impedía avanzar con mejoras del core, parches de seguridad y compatibilidad
con herramientas modernas del ecosistema (TypeScript, parsers, Astro).

Este ADR documenta una decisión **puntual y reversible** para desbloquear la migración.

## Decisión

Priorizar la actualización del core a **ESLint 10** y suspender temporalmente los plugins que impiden la migración:

- Remover `eslint-plugin-import` y sus reglas asociadas.
- Remover `eslint-plugin-jsx-a11y` y sus reglas de accesibilidad.

La suspensión es **temporal** y se revertirá cuando los plugins ofrezcan versiones compatibles
o existan alternativas de bajo mantenimiento.

## Motivación

- Mantener el core de ESLint actualizado reduce deuda técnica y mejora seguridad, rendimiento y compatibilidad.
- Los plugins bloqueantes aportan valor limitado en este repositorio específico:
  - muchas verificaciones de imports ya las cubre `tsc`,
  - la accesibilidad puede mantenerse mediante revisiones manuales y pruebas E2E focalizadas.
- Esperar a que los plugins se actualicen detiene el progreso del ecosistema de tooling.

## Consecuencias

### Positivas

- Migración inmediata a ESLint 10 sin depender de terceros.
- Ecosistema de tooling actualizado y compatible con versiones modernas de TypeScript.
- Reducción de fricción en PRs causada por plugins desactualizados.

### Consideraciones

- Se pierden temporalmente reglas automatizadas de accesibilidad e imports.
- Se recomienda complementar con:
  - `tsc --noEmit` para validar imports,
  - revisiones manuales de accesibilidad en componentes críticos,
  - pruebas E2E con herramientas como `axe` cuando sea necesario.
- La suspensión debe revisarse periódicamente para reincorporar los plugins cuando sea viable.

## Criterios para reincorporar los plugins

- El plugin publica una versión compatible con ESLint 10.
- La actualización no introduce incompatibilidades con el resto del toolchain.
- El valor neto de las reglas supera el coste de mantenimiento.

## Relación con otros ADRs

- Complementa **ADR 004**, que define las reglas de análisis estático semántico.
- Independiente de **ADR 012**, que define decisiones de estilo y formateo.

## Referencias

- [ADR 004: Linting, tipo `any` y convenciones de estilo](004-linting-any-ban-style-conventions.md)
- [ADR 012: Formateo y herramienta de estilo propuesta](012-formatting.md)
