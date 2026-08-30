---
id: ADR-007
title: Unificación de dominio e i18n
status: accepted
date: 2026-03-24
last_updated: 2026-05-21
categories:
  - Architecture
  - i18n
  - Domain
---

## Contexto

La arquitectura de contenido e i18n necesita una regla clara para agrupar
variantes del mismo recurso en distintos locales. Cuando esa identidad no se
expresa de forma explícita, el modelo acaba mezclando nociones de URL, locale,
SEO y traducción, y la lógica se dispersa por múltiples helpers y componentes.

El problema no es solo el almacenamiento de contenido, sino la ausencia de una
fuente única de verdad para decidir cuándo dos entradas son la misma entidad,
cuáles son sus variantes por idioma y cómo debe fallar el sistema ante
inconsistencias.

## Objetivo

Establecer un modelo de dominio para contenido localizado que unifique la
identidad de una entrada, el tratamiento de locales y la generación de enlaces
y metadata SEO, sin mezclar esta responsabilidad con la resolución de rutas ni
con la clave semántica de una traducción.

## Decisión

Adoptar `postId` como la identidad canónica del contenido dentro del dominio.
Una entrada localizada se considera la misma entidad cuando comparte el mismo
`postId`, y cada variante debe además declarar explícitamente su `locale`.

La decisión establece estas invariantes:

1. `postId` agrupa todas las traducciones y variantes de una misma entidad.
2. `locale` es un dato obligatorio y explícito en la entrada normalizada.
3. La construcción de mapas por locale se hace a partir de `postId` para evitar
   doble-mapeo y parseos repetidos.
4. El dominio falla de forma temprana ante inconsistencias críticas como
   duplicados de `(postId, locale)`.

## Rol dentro del sistema i18n

Este ADR tiene un alcance específico y no reemplaza las decisiones de routing ni
las de traducción:

- ADR 001 define cómo se resuelven rutas y aliases de secciones.
- ADR 007 define la identidad del contenido y las invariantes del dominio.
- ADR 011 define la clave semántica de los mensajes traducibles.

En otras palabras, 007 responde a “qué es la misma entrada en distintos
locales”, mientras que 001 responde a “cómo se llega a ella” y 011 responde a
“qué identifica un texto traducido”.

## Implementación

La implementación concreta se apoya en:

- `extractCleanId` como mecanismo estricto de extracción de identidad y locale.
- `entryAdapter` para normalizar contenido y asignar `postId` y `locale`.
- `buildLocaleEntryMap` como mapa estable por `postId` para derivar variantes.
- `SiteLayout` y los helpers de SEO como fuente única de canonical y alternates.
- validación temprana de errores de contenido para evitar estados ambiguos en
  build time.

Estos pasos convierten la lógica del dominio en una API estable y auditable,
separada de la capa de render y de la semántica de traducción.

## Consecuencias

### Positivas

- Unifica la identidad del contenido entre locales.
- Reduce parseos, duplicación y decisiones inconsistente en SEO.
- Hace explícitas las invariantes del dominio y mejora la fiabilidad del build.
- Aclara la frontera entre dominio, routing y traducción.

### A tener en cuenta

- La política de invariantes es estricta y puede requerir correcciones de
  contenido legacy antes del merge.
- Los consumers del dominio deben ajustar su modelo para usar `postId` y
  `locale` como contrato explícito.
- No reemplaza la semántica de `translationKey`; cada capa mantiene su rol.

## Referencias

- [ADR 001](./001-i18n-router-framework.md) — responsabilidad de routing y aliasing por sección.
- [ADR 011](./011-i18n-translationkey.md) — llave canónica para mensajes traducibles.

## Anexos

- [Implementación](./anexos/007-domain-i18n-unificacion/IMPLEMENTATION.md)
