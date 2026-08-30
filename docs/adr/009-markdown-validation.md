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

Adoptar un sistema de validación automática de Markdown que garantice reglas editoriales
reproducibles en cualquier entorno. Actualmente se utiliza **markdownlint-cli2** por cumplir
estos requisitos, pero la decisión se centra en el mecanismo y no en una herramienta específica.

El sistema debe permitir separar reglas editoriales del proyecto de los patrones de ejecución
dependientes del entorno, asegurando una fuente única de verdad para estilo y evitando
duplicación de configuración.

## Alternativas consideradas

- **Reglas distintas para CI y local**
  Rechazada: mantener configuraciones divergentes entre entornos genera deriva, inconsistencias y
  comportamientos inesperados. La gobernanza editorial requiere un conjunto único de reglas.

- **Validación solo en el editor**
  Rechazada: mejora la experiencia local, pero no garantiza obligatoriedad ni coherencia en PRs.
  La validación debe ser parte del pipeline para asegurar consistencia en todo el repositorio.

- **Separación entre reglas editoriales y patrones de ejecución (adoptada)**
  Permite centralizar las reglas del proyecto y ajustar la ejecución según el entorno sin duplicar
  configuración. Este modelo asegura una fuente única de verdad y una validación reproducible.

## Consecuencias

### Positivas

- Reglas de estilo unificadas y reproducibles en cualquier entorno.
- Reducción significativa de ruido en PRs por problemas de formato.
- Base sólida para futuras validaciones automáticas más estrictas.
- Mejora en la coherencia editorial del repositorio.

### A considerar

- Requiere documentación clara para evitar confusiones entre reglas y patrones.
- La configuración puede evolucionar, pero la decisión arquitectónica permanece estable.

## Referencias

- [Markdown validation](../MARKDOWN_VALIDATION.md) - Documentación operativa y comandos
