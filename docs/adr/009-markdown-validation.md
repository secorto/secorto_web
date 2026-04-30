# ADR 009: Validación de Markdown (formato y sincronización de documentación)

> **Estado:** Aceptada
> **Fecha:** 2026-04-30
> **Categoría:** Contenido / Tooling
---

## Contexto

En los últimos cambios se han recibido numerosos comentarios en PRs por mal formato en Markdown (frontmatter incorrecto, encabezados con inconsistencia, código sin fences adecuados, line endings/whitespace, etc.). Al intentar aplicar reglas y actualizar la documentación del proyecto, se detectó que la documentación existente contenía decisiones antiguas que ya no estaban reflejadas en el código. Además, los anexos asociados a ADR-001 contienen ruido y referencias obsoletas que dificultan entender las reglas actuales.

El problema principal a resolver es operativo y de comunicación: reducir el ruido en PRs bloqueando el mal formato y sincronizar la documentación para que refleje las reglas efectivas.

## Decisión

1. Centralizar y automatizar la validación de Markdown en la pipeline de CI para evitar que PRs lleguen con formato inválido. La validación será la fuente de verdad para reglas de estilo y estructura.
2. Limpiar y sincronizar la documentación: actualizar las guías relevantes y archivar (o mover a un anexo claro) el ruido de ADR-001 para que las decisiones vigentes sean fáciles de encontrar.

Implementación mínima inicial:

- Usar y configurar `markdownlint-cli2` (ya presente en el repositorio) mediante un fichero de configuración (`.markdownlint-cli2.json` o `.markdownlint.json`) que incluya las reglas críticas (frontmatter mínimo, presencia/format de `title` y `date` cuando aplique, code fences, encabezados, whitespace)
- Los ficheros de configuración (`.markdownlint-cli2.jsonc` y `.markdownlint.jsonc`) se introducen en este PR
- Reutilizar el script existente `npm run lint:md` (que ejecuta `markdownlint-cli2`) y documentar su uso
- Integrar `npm run lint` en CI antes del build (fallar el job si hay errores críticos). Nota: `npm run lint` ya está definido para ejecutar `lint:js` y `lint:md` en el repositorio
- Documentar en `docs/` la lista de reglas aplicadas y ejemplos de fallos y correcciones
- Mover/archivar anexos ruidosos de ADR-001 a `docs/adr/archived/` con una nota explicativa

## Alternativas consideradas

- Solo linters en editor (p. ej. plugins de VS Code): reduce errores locales pero no garantiza calidad en CI
- Validación solo en pre-commit: útil, pero puede omitirse en merges y contribuciones externas
- Validación en CI (elegida): garantía de que el sitio no se publica con errores, y fuente de verdad para PRs

## Criterios de aceptación

- Los PRs que contienen problemas de formato críticos deben fallar en CI
- La documentación en `docs/` refleja las reglas aplicadas por la tarea de lint (`npm run lint` / `lint:md`)
- Los anexos ruidosos están movidos a `docs/adr/archived/` con una referencia desde ADR-001

## Plan de acción

1. Reescribir este ADR para usar la estructura estándar (ya realizado)
2. Crear/actualizar la configuración de `markdownlint-cli2` y verificar `npm run lint:md` funciona en CI
3. Añadir job en CI (GitHub Actions) que ejecute `npm run lint` en PRs y en la pipeline de build (o confirmar que la acción existente ya lo hace)
4. Actualizar `docs/` con las reglas y ejemplos y mover anexos obsoletos a `docs/adr/archived/`
5. Durante el periodo de adaptación, considerar reportar advertencias en lugar de bloquear en ramas no protegidas

## Riesgos y mitigaciones

- Fricción para contribuyentes: proveer `--fix` cuando sea seguro y ejemplos de corrección; periodo de advertencia
- Reglas incompletas o demasiado estrictas: comenzar con un subconjunto conservador y ampliarlo por iteración

## Notas operativas

- Usar `.markdownlint-cli2.jsonc` para opciones del CLI (ignores, globs) y `.markdownlint.jsonc` para las reglas compartidas
- Crear `npm run lint:md` y actualizar `npm run lint` que ahora eslint se ejecuta con `npm run lint` y dicha tarea ejecuta tanto eslint como markdownlint en CI

## Limitaciones y pasos futuros

- `markdownlint-cli2` cubre estilo y formato de Markdown para `src/content` y `docs/`
- `zod` valida el frontmatter del contenido; por tanto no se aborda aquí
- Pendiente: normalizar formato y consistencia de los ADRs en `docs/adr/` (trabajo futuro)

- Prioridad: desplegar la solución mínima (`markdownlint-cli2` + CI, usando `.markdownlint-cli2.jsonc` y `.markdownlint.jsonc`) y recopilar ejemplos reales antes de ampliar validaciones
