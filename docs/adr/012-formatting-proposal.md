---
title: ADR 012: Formateo y herramienta de estilo propuesta
status: proposed
date: 2026-05-21
categories:
  - Tooling
  - Style
---

## Contexto

La discusión sobre formateo se encontraba parcialmente dentro de `ADR 004`,
pero el cuerpo estaba mezclado con decisiones y cambios ya aplicados. Este ADR
extrae la propuesta de formateo para tomar una decisión independiente y clara.

Problemas detectados:

- Inconsistencia en `;`, `quotes`, `trailing commas` y longitud de línea
- Código generado por herramientas (`playwright codegen`) con estilo distinto
- Sobrecarga de mantener reglas de estilo manualmente en revisiones

### Perfil del desarrollador

El mantenedor principal viene de **Python**, donde:

- No existen los `;` al final de sentencia
- La legibilidad sin ruido sintáctico es un valor
- El formateo lo resuelve una sola herramienta (`black` / `ruff format`)

En el entorno laboral se usa `;` por convención de equipo. En este proyecto
personal, la preferencia es **omitir semicolons** para mantener el código
más limpio y cercano al estilo natural del autor.

## Opciones evaluadas

- **Prettier** (recomendado por comunidad): opinionado, fácil integración con
  `prettier-plugin-astro`, requiere `eslint-config-prettier` para evitar
  conflictos con ESLint.
- **ESLint Stylistic**: un único tool (ESLint) para lint + formato; mayor
  granularidad pero requiere más configuración manual.
- **Mantener convención manual**: baja fricción a corto plazo, pero propenso a
  inconsistencias.

## Propuesta

1. Adoptar **Prettier** con `prettier-plugin-astro` y configurar `eslint-config-prettier`.
2. Establecer reglas de estilo mínimas en ESLint (indentación, no-explicit-any,
   etc.) y delegar el formateo estético a Prettier.
3. Añadir tarea en CI para ejecutar `prettier --check` y `prettier --write` en PRs

## Reglas y convenciones propuestas

### Omitir semicolons — convención con posible migración a formateador

**Decisión propuesta:** omitir `;` al final de sentencias en todo el código del
proyecto.

**Estado actual / transición:** la convención se documentará en
`.github/copilot-instructions.md` y, cuando se adopte Prettier, se aplicará
automáticamente. Temporalmente puede mantenerse como convención manual hasta
que la migración a Prettier se complete.

**Excepción conocida:** el código generado por `npx playwright codegen`
incluye `;` automáticamente. Flujo recomendado:

1. Generar código con `playwright codegen`
2. Copiar al test
3. Ejecutar `prettier --write` o eliminar `;` manualmente antes de commitear

### Indentación a 2 espacios — enforceada

Proponemos enforcear la indentación a 2 espacios en ESLint:

```javascript
'indent': ['error', 2, { SwitchCase: 1 }]
```

Esta regla deberá aplicarse a nivel `error` y habilitarse el autofix (`--fix`) en
scripts/CI para correcciones automáticas.

## Consecuencias

- +Compatibilidad mejorada con editores y herramientas de terceros.
- +Decisiones de estilo centralizadas y aplicadas automáticamente.
- +Pequeño incremento en toolchain (instalar Prettier y plugin), pero menor
  fricción en reviews.

## Siguientes pasos

1. Probar Prettier con `prettier-plugin-astro` en una rama experimental.
2. Ajustar `package.json` scripts y CI para `prettier --check`.
3. Documentar la decisión y marcar este ADR como `accepted` cuando se implemente.
