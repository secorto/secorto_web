# ADR 010: Normalizar formato ADR y gobernanza de ADRs generados por IA

> **Estado:** Propuesta
> **Fecha:** 2026-05-01
> **Categoría:** Contenido / Tooling
---

## Contexto

La carpeta `docs/adr/` muestra inconsistencias de formato entre ADRs: mezcla de cabeceras ATX y setext, numeración de listas inconsistente (`1.` vs `1)`) y algunos archivos con frontmatter YAML en lugar del bloque de metadatos con blockquote establecido desde `ADR 001`. Además, `ADR 001` acumula anexos que mezclan histórico, notas operativas y documentación viva sin responsables ni ciclos de revisión definidos.

El problema se agravó con el uso de asistentes IA que generan ADRs con formatos distintos al del proyecto, introduciendo ruido en revisiones de PR y dificultando la auditoría posterior.

La validación sintáctica con `markdownlint-cli2` adoptada en `ADR 009` reduce errores de formato Markdown pero no garantiza consistencia de estructura ni cubre el proceso de revisión para ADRs generados por IA.

## Decisión

1. Esquema de nombres para ADRs: `NNN-slug-descriptivo.md` (ej.: `001-i18n-router-framework.md`). Mantener numeración secuencial y minúsculas en el slug.

2. Establecer `docs/adr/TEMPLATE.md` como plantilla canónica con las siguientes reglas de formato:
   - Metadatos en bloque blockquote: `> **Estado:**`, `> **Fecha:**`, `> **Categoría:**`
   - Separador `---` inmediatamente después del bloque de metadatos
   - Secciones exclusivamente con cabeceras ATX H2 (`##`); prohibido usar setext (`---` o `===` bajo texto)
   - Listas numeradas con punto: `1.`, `2.`; no con paréntesis: `1)`, `2)`
   - Sin frontmatter YAML
   - Idioma por defecto: español (`es`)

3. Todo ADR nuevo —generado por humano o por IA— debe seguir `docs/adr/TEMPLATE.md`. Los PRs que introduzcan ADRs nuevos deben incluir la etiqueta `adr-review` y asignar un revisor humano antes de merge.

4. Los anexos de `ADR 001` se auditarán y clasificarán en:
   - `docs/anexos/` — documentación viva, con `owner` y `last-reviewed` en cabecera
   - `docs/archives/` — material histórico sin mantenimiento activo

5. Se creará un template `.github/ISSUE_TEMPLATE/tarea-adr.yml` para que cada tarea del plan de trabajo de un ADR se convierta en un issue con estructura consistente. El issue debe incluir: número de ADR, descripción de la tarea y criterios de aceptación mínimos. GitHub maneja asignación; las fechas se definen según disponibilidad.

## Consecuencias

- Los ADRs 001–009 pueden presentar inconsistencias menores de formato; se normalizarán de forma incremental en PRs separados sin modificar el contenido de las decisiones.
- Los ADRs generados por herramientas IA requerirán revisión de formato antes de merge.
- La extracción de anexos de `ADR 001` reduce ruido en ese archivo y convierte la documentación viva en artefactos mantenibles con dueños claros.

## Plan de trabajo

1. Publicar `docs/adr/TEMPLATE.md` con la estructura definida — owner: @secorto — fecha objetivo: 2026-05-03
2. Auditar y clasificar los anexos de `ADR 001` — owner: @secorto — fecha objetivo: 2026-05-07
3. Extraer anexos vivos a `docs/anexos/` y archivar el histórico en `docs/archives/` — owner: responsable asignado — fecha objetivo: 2026-05-10
4. Añadir requisito `adr-review` en el flujo de revisión de PRs — owner: maintainers — fecha objetivo: 2026-05-05

## Riesgos y mitigaciones

- Riesgo: normalización de formato en ADRs existentes puede confundirse con cambios de decisión → Mitigación: commits exclusivos de formato con mensaje descriptivo, sin alterar el contenido
- Riesgo: fricción adicional en PRs con ADRs generados por IA → Mitigación: checklist en `docs/adr/TEMPLATE.md` y validación automática vía `markdownlint` (ADR 009)

## Referencias

- [ADR 001](001-i18n-router-framework.md) — fuente de los anexos a auditar
- [ADR 009](009-markdown-validation.md) — validación de Markdown con `markdownlint-cli2`
