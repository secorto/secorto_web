---
id: ADR-006
title: Unificación del manejo de borradores (`draft`)
status: accepted
date: 2026-02-13
last_updated: null
categories:
  - Content
  - i18n
  - Tooling
---

## Contexto

El repositorio gestiona contenido multilingüe con metadatos asociados a cada entrada.
Históricamente se utilizaron dos mecanismos para indicar que un contenido no debía ser publicado:
un campo específico para estados de traducción y un campo booleano para marcar borradores.

La coexistencia de ambos mecanismos generó complejidad accidental:

- Dos fuentes de verdad para determinar si un contenido debía ser visible.
- Lógica dispersa para inferir estados de borrador a partir de estados de traducción.
- Riesgo de inconsistencias entre contenido antiguo y comportamiento esperado.

El campo booleano `draft` ofrece una convención simple y explícita para indicar que una entrada no debe ser publicada.

---

## Objetivo

Establecer un mecanismo único, claro y determinista para indicar que una entrada es un borrador,
reduciendo complejidad y evitando inferencias implícitas.

---

## Decisión

Adoptar `draft: true` como **única** señal de borrador en el frontmatter.
El campo histórico de estados de traducción podrá mantenerse como metadata auxiliar,
pero no participará en la determinación de visibilidad.

---

## Implementación

La implementación concreta se documenta en los archivos de arquitectura correspondientes.
A nivel conceptual, la decisión implica:

- Incorporar `draft` como parte del esquema de metadatos del contenido.
- Basar la visibilidad, indexación y avisos únicamente en el valor de `draft`.
- Evitar cualquier inferencia automática desde estados de traducción.
- Mantener los estados de traducción como metadata histórica sin impacto en la lógica de borradores.

---

## Consecuencias

### Positivas

- Un único mecanismo explícito para determinar borradores.
- Reducción de complejidad accidental en la lógica de visibilidad.
- Mayor claridad para editores humanos y herramientas automáticas.
- Migración simple desde estados históricos hacia el nuevo mecanismo.

### A considerar

- Algunos contenidos antiguos pueden requerir normalización manual o asistida.
- El campo histórico de estados de traducción puede permanecer como metadata obsoleta hasta su eventual limpieza.

---

## Referencias

- [Gobernanza de contenido multilingüe](../CONTENT_POLICY.md)

## Anexos

- [Implementación](anexos/006-unificacion-manejo-borradores/IMPLEMENTATION.md)
