---
id: ADR-009
title: Validación de Markdown (formato y sincronización de documentación)
status: accepted
date: 2026-05-01
last_updated: 2026-08-29
categories:
  - Content
  - Tooling
---

## Contexto

El repositorio presenta inconsistencias frecuentes en archivos Markdown: encabezados desalineados,
uso irregular de fences, URLs sin formato, variaciones en whitespace y otros problemas de estilo.
Estos defectos generan ruido en revisiones de PR y dificultan mantener una base documental coherente.

El problema no es técnico sino de **gobernanza editorial**:
se requiere una herramienta que aplique reglas reproducibles tanto localmente como en CI,
evitando correcciones manuales repetitivas.

## Objetivo

Establecer un mecanismo único y consistente para validar el formato Markdown en todo el proyecto,
garantizando que las reglas de estilo se apliquen de manera uniforme en cualquier entorno.

## Decisión

Adoptar **markdownlint-cli2** como herramienta estándar de validación de Markdown, utilizando:

- Un archivo de reglas centralizado (`.markdownlint.jsonc`)
- Un archivo de opciones de ejecución (`.markdownlint-cli2.jsonc`) para globs, exclusiones y configuración de CLI

La separación entre reglas y patrones permite mantener una fuente única de verdad para estilo,
mientras se ajustan los patrones según necesidades del entorno.

## Alternativas consideradas

- **Reglas distintas para CI y local**
  Rechazada: genera deriva y comportamientos inesperados.
  La capacidad de `severity` en markdownlint permite flexibilidad sin duplicar reglas.

- **Solo linters en editor**
  Rechazada: mejora la experiencia local, pero no garantiza consistencia en CI ni obligatoriedad en PRs.

- **Separación reglas vs patterns (adoptada)**
  Permite centralizar estilo y ajustar ejecución sin duplicar configuración.

## Consecuencias

### Positivas

- Reglas de estilo unificadas y reproducibles en cualquier entorno.
- Reducción significativa de ruido en PRs por problemas de formato.
- Base sólida para futuras validaciones automáticas más estrictas.
- Mejora en la coherencia editorial del repositorio.

### A tener en cuenta

- Requiere documentación clara para evitar confusiones entre reglas y patrones.
- La configuración puede evolucionar, pero la decisión arquitectónica permanece estable.

## Referencias

- [Markdown validation](../MARKDOWN_VALIDATION.md) - Documentación operativa y comandos
