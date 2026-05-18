---
title: ADR 010: Plantilla estándar de ADRs
status: proposed
date: 2026-05-01
last_updated: null
categories:
  - Content
  - Tooling
---

## Contexto

La carpeta `docs/adr/` actual usa un formato **consistente** de metadatos basado en `blockquote`
(establecido desde `ADR 001`) y cabeceras ATX, pero sigue habiendo inconsistencias menores:
numeración de listas inconsistente (`1.` vs `1)`) y ausencia de validación automatizada de estructura.

Aunque el estado es ya más uniforme que en versiones anteriores, persisten dos retos:

1. **Sin validación automática:** no hay herramienta que fuerce la presencia de secciones obligatorias
   (Contexto, Decisión, Consecuencias). El formato actual basado en `blockquotes` carece de análisis estructurado
   que permita validar presencia de campos o sincronizar metadatos.
2. **Inconsistencia generada por IA:** los asistentes IA generan ADRs con formatos distintos;
   adoptar `frontmatter` YAML estándar permite validación automática de estructura y facilita
   que las instrucciones sean seguidas uniformemente.

La validación sintáctica con `markdownlint-cli2` adoptada en `ADR 009`
reduce errores de formato Markdown pero no garantiza consistencia de estructura ni presencia de secciones.

## Objetivo

Definir una plantilla canónica para ADRs y normalizar metadatos con `frontmatter` YAML,
facilitando validación automática y mejorando consistencia visual del repositorio.
Actualizar las instrucciones para asistentes IA para que produzcan ADRs conformes al formato.

## Decisión

Adoptar una plantilla estándar para ADRs que define cabeceras mínimas,
secciones obligatorias y metadatos normalizados (`frontmatter` YAML).

## Implementación

- Crear `docs/adr/TEMPLATE.md` que especifique:
  - `Frontmatter` YAML con campos: `status`, `date`, `last_updated`, `categories`.
    **Note:** `categories` is an array of strings
  - Recomendación adicional para metadatos de reconstrucción/historia:
    - `repository`: repositorio origen o nombre histórico (string)
    - `commits`: número aproximado de commits migrados (number)
    - `start_year`: año de inicio del repositorio/mantenimiento (number)
    - `end_year`: año de fin. **Omisión** de `end_year` se interpreta como "present".
      - Recomendar: si se quiere dejar explícito, usar `end_year: null` para indicar abierto/en curso;
        la plantilla debe documentar que la ausencia es equivalente a presente para compatibilidad con ADRs anteriores.
    - `replaced_by`: campo opcional que apunta al ADR que reemplaza a este
      (string, preferiblemente filename relativo, p.ej. `R03-migracion-gatsby-a-astro.md`).
  - Secciones obligatorias: Contexto, Objetivo, Decisión, Implementación,
    Consecuencias (Positivas / A tener en cuenta), Referencias.
- Actualizar `docs/adr/README.md` — sección **Convenciones** — para documentar el nuevo formato
  `frontmatter` YAML como fuente única de verdad para autores humanos.
- Normalizar ADRs existentes en PRs separados y claramente marcados (commits de
  formato que **reemplazan completamente** `blockquotes` por `frontmatter` YAML,
  sin mezcla de ambos formatos).
- Actualizar `.github/copilot-instructions.md` para que asistentes IA generen ADRs conformes
  con `frontmatter` YAML desde el inicio.

## Consecuencias

### Positivas

- Plantilla canónica proporciona referencia clara para autores (humanos e IA)
- Normalización visual de ADRs facilita revisiones y búsquedas
- Base estructural para validación automática futura (frontmatter, secciones obligatorias)
- Commits de normalización quedan claramente marcados (formato, no cambios de decisión)

### Trabajo futuro habilitado

- **Validación de `frontmatter` YAML:** implementar scripts que validen estructura mínima
  y campos obligatorios en `CI` (p.ej. con Zod, JSON Schema, o validador personalizado)
- **Integración en `linters`:** extender `markdownlint` o herramientas similares para forzar
  cabeceras obligatorias y secciones mínimas
- **Auditoría de anexos:** revisar ciclo de vida y responsables de la carpeta `docs/adr/anexos/`
  (gobernanza fuera del alcance de este ADR)

## Referencias

- [ADR 009](009-markdown-validation.md) — validación de Markdown con `markdownlint-cli2`
