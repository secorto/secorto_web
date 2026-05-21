---
title: ADR 013: Actualización a ESLint 10 y eliminación temporal de plugins
status: accepted
date: 2026-05-21
categories:
  - Tooling
  - Code Quality
---

## Contexto

El mantenimiento de los plugins `eslint-plugin-import` y `eslint-plugin-jsx-a11y`
estaba retrasando la actualización del core de ESLint: los PRs de
compatibilidad llevaban meses estancados y provocaban ruido en la
configuración. En este repositorio en particular los PRs relevantes han
estado esperando actualizaciones desde febrero de 2026, lo que bloqueó la
posibilidad de migrar a **ESLint 10**.

La decisión central fue si seguir esperando a que esos plugins se actualicen
o priorizar la migración del core a ESLint 10. Se eligió priorizar la
actualización del core debido a sus beneficios transversales y al coste de
mantener plugins desactualizados. La eliminación temporal de `import` y
`jsx-a11y` fue un efecto secundario de esta elección, no la intención inicial.

## Decisión

Priorizar la migración a **ESLint 10** y, como medida temporal y reversible,
remover las reglas dependientes de `eslint-plugin-import` y
`eslint-plugin-jsx-a11y` para desbloquear la actualización.

Se removieron temporalmente las siguientes dependencias/reglas:

- `eslint-plugin-import` (p. ej. `import/no-unresolved`, `import/no-extraneous-dependencies`)
- `eslint-plugin-jsx-a11y` (reglas de accesibilidad para JSX/Frontmatter)

Motivación resumida:

- Los PRs upstream de estos plugins han estado estancados desde febrero de 2026
  en este proyecto y no ofrecen una ventana clara de resolución.
- La actualización a ESLint 10 aporta parches de seguridad, mejoras en la API y
  compatibilidad con herramientas modernas (TypeScript, parsers), beneficios
  que afectan a todo el repositorio.
- El valor práctico de las reglas de esos plugins en este repositorio es
  limitado o parcialmente redundante con `tsc` y pruebas existentes, por lo
  que el coste de mantenerlos desactualizados supera su beneficio inmediato.

## Por qué priorizar ESLint 10 sobre mantener estos plugins

- Actualizar el core a ESLint 10 ofrece beneficios transversales: parches de
  seguridad, mejoras de rendimiento, y compatibilidad con nuevas versiones de
  parsers y herramientas (TypeScript, plugins futuros). Mantener el core
  actualizado reduce deuda técnica a largo plazo.
- Los plugins eliminados aportaban valor real pero limitado respecto a lo que
  ya cubren otras herramientas del proyecto: `import/no-unresolved` se
  solapa en muchos casos con las comprobaciones de TypeScript/`tsc`, y las
  comprobaciones de accesibilidad de `jsx-a11y` pueden complementarse con
  revisiones manuales o E2E focalizadas mientras se estabiliza la migración.
- Mantener plugins desactualizados bloquea el progreso del resto del
  ecosistema y genera fricción en PRs; priorizar el core permite avanzar con
  mejoras que benefician a todo el proyecto.

## Compensaciones y mitigaciones

- Riesgo: pérdida de reglas automatizadas para accesibilidad y verificación
  de imports. Mitigación:
  - Mantener `@typescript-eslint` y reglas clave (`no-explicit-any`, `no-unused-vars`).
  - Añadir comprobaciones en CI: `tsc --noEmit` para validar imports y scripts
    de validación de imports si procede.
  - Para accesibilidad, mantener controles E2E/axe en pruebas críticas y
    priorizar revisiones manuales de componentes hasta reincorporar o
    reemplazar las reglas.

- Reversibilidad: la eliminación es temporal y puede revertirse una vez que los
  plugins ofrezcan soporte compatible con ESLint 10 o exista una alternativa
  de bajo mantenimiento.

## Plan de migración sugerido

1. Crear una rama y actualizar `eslint` a v10.
2. Actualizar parser y dependencias relacionadas (`@typescript-eslint`, etc.).
3. Ejecutar `tsc --noEmit` y la suite de tests; corregir errores reportados.
4. Adaptar reglas faltantes mediante reglas nativas o scripts de CI (p. ej.
   validación de imports) y documentar las diferencias.
5. Reintroducir plugins solo si son compatibles con ESLint 10 o existen
   alternativas de bajo mantenimiento.
6. Añadir checks en CI para `eslint --ext .ts,.astro` y `tsc --noEmit`.

## Criterios para reincorporar plugins

- El plugin ofrece una versión compatible y estable para ESLint 10.
- La versión nueva no introduce cambios incompatibles que bloqueen otras
  dependencias críticas.
- El valor neto de las reglas del plugin supera el coste de mantenimiento.

## Relación con otros ADRs

Este cambio complementa y aclara decisiones de `ADR 004` (Linting, `any` y
convenciones). Ver también:

- [ADR 004: Linting, tipo `any` y convenciones de estilo](004-linting-any-ban-style-conventions.md)
- [ADR 012: Formateo y herramienta de estilo propuesta](012-formatting-proposal.md)
