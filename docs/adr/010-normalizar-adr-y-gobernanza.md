# ADR 010: Normalizar formato ADR y gobernanza de ADRs generados por IA

> **Estado:** Propuesta
> **Fecha:** 2026-05-01
> **Categoría:** Contenido / Tooling
---

## Contexto

La carpeta `docs/adr/` muestra inconsistencias de formato entre ADRs:
mezcla de cabeceras ATX y setext, numeración de listas inconsistente (`1.` vs `1)`)
y algunos archivos con frontmatter YAML en lugar del bloque de metadatos con blockquote establecido desde `ADR 001`.
Además, `ADR 001` acumula anexos que mezclan histórico,
notas operativas y documentación viva sin responsables ni ciclos de revisión definidos.

El problema se agravó con el uso de asistentes IA que generan ADRs con formatos distintos al del proyecto,
introduciendo ruido en revisiones de PR y dificultando la auditoría posterior.

La validación sintáctica con `markdownlint-cli2` adoptada en `ADR 009`
reduce errores de formato Markdown pero no garantiza consistencia de estructura
ni cubre el proceso de revisión para ADRs generados por IA.

## Objetivo

Definir una plantilla canónica para ADRs y un esquema de metadata validable (frontmatter YAML),
y actualizar las instrucciones para asistentes IA para que produzcan ADRs conformes.

## Decisión

- Crear `docs/adr/TEMPLATE.md` con ejemplo de frontmatter YAML mínimo (
  campos recomendados: `estado`, `fecha`, `ultima-actualizacion`, `categoria`).
- Adoptar frontmatter YAML como formato canónico para metadata, para permitir validación automática
  (por ejemplo con Zod/JSON Schema).
- Actualizar `copilot-instructions.md` para que las salidas de IA generen ADRs
  respeten la plantilla y produzcan frontmatter YAML válido.

## Alcance

- Obligatorio: esta ADR establece el formato objetivo y requiere la normalización
  de los ADRs existentes en PRs separados y claramente marcados (commits de
  formato que no cambien el sentido de las decisiones). El objetivo es unificar
  el formato del repositorio para facilitar validación y búsquedas.
- Incluye la especificación del formato (frontmatter YAML) y la plantilla canónica;
  la implementación técnica (scripts de validación e integración en CI) se
  planificará y ejecutará como pasos siguientes.

## Riesgos y mitigaciones

- Riesgo: normalización de formato en ADRs existentes puede confundirse con cambios de decisión → Mitigación:
  commits exclusivos de formato con mensaje descriptivo, sin alterar el contenido
- Riesgo: fricción adicional en PRs con ADRs generados por IA → Mitigación: checklist en `docs/adr/TEMPLATE.md`
  y validación automática vía `markdownlint` (ADR 009)

## Referencias

- [ADR 009](009-markdown-validation.md) — validación de Markdown con `markdownlint-cli2`
- [ADR README](README.md) — gobernanza y anexos (sección "Gobernanza y anexos")
