---
id: ADR-010
title: Plantilla estándar de ADRs
status: accepted
date: 2026-05-01
last_updated: 2026-08-29
categories:
  - Content
  - Tooling
---

## Contexto

La carpeta de registros de decisiones arquitectónicas (ADRs) actual usa un formato consistente de metadatos
 basado en bloques de citas y cabeceras ATX, pero sigue habiendo inconsistencias menores:
  numeración de listas inconsistente y ausencia de validación automatizada de estructura.

Aunque el estado es ya más uniforme que en versiones anteriores, persisten dos retos:

1. **Sin validación automática:** no hay herramienta que fuerce la presencia de secciones obligatorias
  (Contexto, Decisión, Consecuencias). El formato previo carece de un análisis estructurado
  que permita validar la presencia de campos o sincronizar metadatos.
2. **Inconsistencia generada por IA:** los asistentes de IA generan ADRs con formatos distintos;
  adoptar un bloque de metadatos superior (`frontmatter` YAML) estándar permite la validación automática
  de la estructura y facilita que las instrucciones sean seguidas uniformemente.

La validación sintáctica adoptada previamente reduce errores de formato Markdown,
pero no garantiza la consistencia de la estructura ni la presencia de las secciones core.

## Objetivo

Definir una plantilla canónica para ADRs y normalizar los metadatos con `frontmatter` YAML,
facilitando la validación automática y mejorando la consistencia visual del repositorio.
Actualizar las instrucciones para asistentes de IA para que produzcan ADRs conformes al formato.

## Decisión

Adoptar una plantilla estándar para ADRs que define cabeceras mínimas,
secciones obligatorias y metadatos normalizados mediante `frontmatter` YAML.

Los ADRs deben mantener la decisión **agnóstica a detalles de implementación concretos**:
los contextos y decisiones deben abordar problemas y patrones abstractos,
mientras que los archivos de arquitectura específicos se encargarán de mapear el diseño con las clases, herramientas o archivos reales.

## Implementación

- **Creación de la plantilla canónica:** Definir un archivo de plantilla que sirva de base
  con la estructura de metadatos (`frontmatter` YAML) y las secciones obligatorias requeridas.
- **Documentación de convenciones:** Actualizar el archivo de directrices de la carpeta de ADRs
  para oficializar el nuevo formato como la fuente única de verdad para autores humanos.
- **Configuración de herramientas de asistencia:** Adaptar las instrucciones del entorno de desarrollo
  y asistentes de IA para asegurar que las nuevas propuestas se generen alineadas al estándar desde el inicio.
- **Migración progresiva:** Normalizar los registros de decisiones existentes mediante cambios dedicados
  exclusivamente a la actualización de formato, garantizando un historial limpio sin alterar las decisiones pasadas.

## Consecuencias

### Positivas

- La plantilla canónica proporciona una referencia clara para autores (humanos e IA).
- La normalización visual de los ADRs facilita las revisiones y búsquedas.
- Se establece una base estructural para la validación automática futura (campos y secciones obligatorias).
- Los commits de normalización quedan claramente marcados como cambios de formato, sin mezclar alteraciones en las decisiones.

### Trabajo futuro habilitado

- **Validación de metadatos:** Implementar scripts en el flujo de integración continua (CI)
  que validen la estructura mínima y los campos obligatorios del YAML.
- **Integración en linters:** Extender las herramientas de análisis estático de Markdown
  para forzar la existencia de las secciones requeridas.
- **Auditoría de anexos:** Revisar el ciclo de vida y la gobernanza de los archivos complementarios de la documentación.

## Referencias

- [ADR 009](009-markdown-validation.md) — validación de Markdown con `markdownlint-cli2`

## Anexos

- [Implementación](anexos/010-plantilla-estandar-adr/IMPLEMENTATION.md)
