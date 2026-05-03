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

Adoptar una plantilla estándar para ADRs que define cabeceras mínimas,
secciones obligatorias y metadata normalizada (frontmatter YAML).

## Implementación

- Crear `docs/adr/TEMPLATE.md` que especifique:
  - Frontmatter YAML con campos: `estado`, `fecha`, `ultima-actualizacion`, `categoria`.
  - Secciones obligatorias: Contexto, Objetivo, Decisión, Implementación,
    Consecuencias (Positivas / A tener en cuenta), Referencias.
- Normalizar ADRs existentes en PRs separados y claramente marcados (commits de
  formato que no cambien el sentido de las decisiones).
- Actualizar `.github/copilot-instructions.md` para que asistentes IA generen ADRs conformes.

## Consecuencias

### Positivas

- Plantilla canónica proporciona referencia clara para autores (humanos e IA)
- Normalización visual de ADRs facilita revisiones y búsquedas
- Base estructural para validación automática futura (frontmatter, secciones obligatorias)
- Commits de normalización quedan claramente marcados (formato, no cambios de decisión)

### Trabajo futuro habilitado

- **Validación de frontmatter YAML:** implementar scripts que validen estructura mínima
  y campos obligatorios en CI (p.ej. con Zod, JSON Schema, o validador personalizado)
- **Integración en linters:** extender `markdownlint` o herramientas similares para forzar
  cabeceras obligatorias y secciones mínimas
- **Auditoría de anexos:** revisar ciclo de vida y responsables de la carpeta `docs/adr/anexos/`
  (gobernanza fuera del alcance de este ADR)

## Referencias

- [ADR 009](009-markdown-validation.md) — validación de Markdown con `markdownlint-cli2`
