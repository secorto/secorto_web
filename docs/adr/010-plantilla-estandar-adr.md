# ADR 010: Plantilla estándar de ADRs

> **Estado:** Propuesta
> **Fecha:** 2026-05-01
> **Categoría:** Contenido / Tooling
---

## Contexto

La carpeta `docs/adr/` muestra inconsistencias de formato entre ADRs:
mezcla de cabeceras ATX y setext, numeración de listas inconsistente (`1.` vs `1)`)
y algunos archivos con frontmatter YAML en lugar del bloque de metadatos con blockquote establecido desde `ADR 001`.

El problema se agravó con el uso de asistentes IA que generan ADRs con formatos distintos al del proyecto,
introduciendo ruido en revisiones de PR.

La validación sintáctica con `markdownlint-cli2` adoptada en `ADR 009`
reduce errores de formato Markdown pero no garantiza consistencia de estructura.

## Objetivo

Definir una plantilla canónica para ADRs y normalizar metadata con frontmatter YAML,
facilitando validación automática y mejorando consistencia visual del repositorio.
Actualizar las instrucciones para asistentes IA para que produzcan ADRs conformes al formato.

## Decisión

- Crear `docs/adr/TEMPLATE.md` con plantilla canónica que incluya:
  - Cabeceras mínimas requeridas: título, bloque de metadatos (estado, fecha, categoría).
  - Secciones obligatorias: Contexto, Objetivo, Decisión, Alcance, Riesgos y mitigaciones, Referencias.
  - Ejemplo de frontmatter YAML con campos: `estado`, `fecha`, `ultima-actualizacion`, `categoria`.
- Normalizar ADRs existentes para adoptar esta estructura en PRs separadas.
- Actualizar `copilot-instructions.md` para que asistentes IA generen ADRs
  respetando la plantilla y estructura de cabeceras.

## Alcance

- Establecer la plantilla canónica con cabeceras y secciones mínimas obligatorias.
- Normalizar ADRs existentes en PRs separados y claramente marcados (commits de
  formato que no cambien el sentido de las decisiones).
- Actualizar `copilot-instructions.md` para que asistentes IA generen ADRs conformes.

## Riesgos y mitigaciones

- Riesgo: normalización de formato en ADRs existentes puede confundirse con cambios de decisión → Mitigación:
  commits exclusivos de formato con mensaje descriptivo, sin alterar el contenido.
- Riesgo: futuros ADRs (incluyendo IA-generados) no respeten la plantilla → Mitigación:
  una vez adoptada la plantilla como referencia canónica, los autores (humanos e IA) tendrán
  una especificación clara. La validación automática de estructura y frontmatter se habilitará
  como future step (ver más abajo).

## Próximos pasos

- **Validación de frontmatter YAML:** implementar scripts que validen estructura mínima
  y campos obligatorios en CI (p.ej. con Zod, JSON Schema, o validador personalizado).
- **Integración en linters:** extender `markdownlint` o herramientas similares para forzar
  cabeceras obligatorias y secciones mínimas.
- **Auditoría de anexos:** revisar ciclo de vida y responsables de la carpeta `docs/adr/anexos/`
  (gobernanza fuera del scope de este ADR).

## Referencias

- [ADR 009](009-markdown-validation.md) — validación de Markdown con `markdownlint-cli2`
