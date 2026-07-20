---
title: ADR 009 - Validación de Markdown (formato y sincronización de documentación)
status: accepted
date: 2026-05-01
last_updated: 2026-05-02
categories:
  - Content
  - Tooling
---

**Alcance:** Este ADR cubre la adopción de herramientas de validación
sintáctica y de estilo de Markdown con reglas reproducibles.

## Contexto

En los cambios recientes se han recibido numerosos comentarios en PRs por
formato inconsistente en Markdown (encabezados, fence code, line endings,
URLs, etc.). El problema principal es operativo: reducir el ruido en PRs
mediante reglas reproducibles y automáticas que eviten correcciones manuales
repetidas.

## Decisión

Adoptar un sistema de validación de Markdown con herramientas automatizadas
que:

1. **Define reglas de estilo** centralizadas aplicables en CI y localmente.
2. **Ejecuta validación** en ambos contextos (developer machine y CI) con
   las mismas reglas.
3. **Permite correcciones automáticas** cuando sea posible (autofix).
4. **Documentan excepciones** para casos específicos (p. ej. código generado).

### Características clave

- Reglas consistentes entre CI y local.
- Capacidad de autofix para correcciones automáticas.
- Flexibilidad en severidad (error vs warning) por regla.
- Compatibilidad con globbing y exclusiones de archivos.

---

## Alternativas consideradas

- **Mantener validación manual:** rechazado por alta fricción en reviews y
  propenso a inconsistencias.
- **Solo linters en editor:** rechazado por no garantizar calidad en CI ni
  ser obligatorio.
- **Dos conjuntos de reglas distintos (local vs CI):** rechazado por riesgo
  de deriva y bloqueos inesperados.

---

## Consecuencias

### Positivas

- Validación consistente: mismas reglas en local y CI.
- Autofix reduce fricción en development.
- Reglas centralizadas y fáciles de auditar y actualizar.

### Consideraciones

- Requiere configuración y mantenimiento de archivos de reglas.
- Puede necesitar ajustes iniciales en archivos existentes.
- Requiere que los desarrolladores instalen herramientas localmente.

---

## Referencias y detalles operativos

Para configuración específica, scripts de CI, archivos de reglas y comandos:
ver [docs/MARKDOWN_VALIDATION.md](../MARKDOWN_VALIDATION.md).
