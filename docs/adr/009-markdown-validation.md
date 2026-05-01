# ADR 009: Validación de Markdown (formato y sincronización de documentación)

> **Estado:** Aceptada
> **Fecha:** 2026-05-01
> **Categoría:** Contenido / Tooling
---

**Alcance:** Este ADR se limita a la adopción e integración inicial de `markdownlint-cli2`
como herramienta de validación sintáctica y de estilo de Markdown en CI.
La gobernanza de la documentación
(clasificación de anexos, políticas de archivado, owners y procesos de revisión)
queda fuera del alcance de este ADR y se tratará en un ADR o issue separados.

## Contexto

En los últimos cambios se han recibido numerosos comentarios en PRs por mal formato en Markdown
(encabezados inconsistentes, código sin fences adecuados,
line endings/whitespace, URLs desnudas, etc.).
El problema principal a resolver es operativo y de comunicación:
reducir el ruido en PRs aplicando reglas reproducibles
que eviten correcciones manuales repetidas.

## Decisión

Centralizar y automatizar la validación de Markdown
en el pipeline de CI mediante `markdownlint-cli2`.
La herramienta se usará para aplicar reglas sintácticas y de estilo;
la validación semántica del frontmatter seguirá siendo
responsabilidad de las content collections en build time.

## Implementación mínima inicial

- Añadir y publicar una configuración local estricta: `.markdownlint.jsonc`
(para uso de desarrolladores)
- Añadir y publicar una configuración para CI con excepciones documentadas:
`.markdownlint-ci.jsonc`
- Añadir scripts en `package.json`: `npm run lint:md` (local, estricto) y
`npm run lint:md:ci` (CI con excepciones)
- Documentar en `docs/` la lista de reglas aplicadas, globs/ignores y cómo usar `--fix`
- Registrar las tareas y deuda en issues de GitHub:
ver los issues referenciados en Plan de acción

Nota: la validación semántica del frontmatter (presencia/formatos de `title`, `date`, etc.)
queda fuera del alcance de este ADR.

## Alternativas consideradas

- Solo linters en editor: reduce errores locales pero no garantiza calidad en CI
- Validación en pre-commit: útil, pero puede omitirse en merges externos
- Validación en CI (elegida): garantiza que el sitio no se publica con errores
  y centraliza las reglas

## Criterios de aceptación

- `npm run lint:md` está documentado y ejecutable localmente (configuración estricta)
- CI ejecuta `npm run lint:md:ci` y reporta resultados
- Las decisiones de endurecimiento y eliminación de excepciones
  están registradas en los issues correspondientes (véase Plan)
- Documentación en `docs/` que explica cómo corregir fallos y usar `--fix`

## Plan de acción (issues)

1. Issue **#139 — Configuración inicial markdownlint**: añadir ambas configuraciones
  (`.markdownlint.jsonc` y `.markdownlint-ci.jsonc`)
  y los scripts `lint:md` / `lint:md:ci`, junto con documentación mínima.
2. Issue **#140 — Unificar reglas de configuración de markdownlint**:
  auditar excepciones y planificar la convergencia entre CI y local; eliminar excepciones no justificadas por fases.
3. Implementar cada issue mediante PRs que referencien su issue correspondiente
  para mantener trazabilidad.

## Riesgos y mitigaciones

- Fricción para contribuyentes: ofrecer `--fix` y ejemplos de corrección;
  periodo de advertencia antes de bloquear merges
- Reglas incompletas o demasiado estrictas: desplegar configuración laxa en CI inicialmente
  y endurecer por iteraciones planificadas

## Notas operativas

- Mantener dos ficheros de reglas: `.markdownlint.jsonc` (local, estricto)
  y `.markdownlint-ci.jsonc` (CI con excepciones revisables)
- Usar `.markdownlint-cli2.jsonc` para opciones del CLI (globs/ignores) si procede
- Registrar la deuda y el plan de endurecimiento en `#140`
  y actualizar este ADR con enlaces a los issues cuando estén abiertos

## Limitaciones y pasos futuros

- Pendiente: normalizar formato y consistencia de los ADRs en `docs/adr/` (trabajo futuro)
- Prioridad: desplegar la solución mínima
  y recopilar ejemplos reales antes de ampliar validaciones
