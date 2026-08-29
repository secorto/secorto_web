---
id: ADR-011
title: Llave canónica de traducción
status: accepted
date: 2026-05-18
last_updated: 2026-08-29
categories:
  - Architecture
  - i18n
  - Domain
---

## Contexto

Cuando la identidad del recurso y la identidad del mensaje traducible se mezclan,
la arquitectura se vuelve ambigua. El mismo identificador termina sirviendo para
varios propósitos distintos: localizar un recurso, resolver una variante por
locale y seleccionar el texto final para un usuario.

Esto no es un problema de sintaxis, sino de semántica: el sistema necesita un
contrato claro para distinguir entre “esta entidad es la misma” y “este mensaje
es el mismo texto traducible”.

## Objetivo

Definir una regla de diseño que mantenga separadas la identidad del contenido y
la identidad del mensaje en todas las capas del sistema de i18n.

## Decisión

Adoptar una llave canónica de traducción, estable y semántica, separada de la
identidad del recurso. El nombre concreto del campo puede variar en la
implementación (por ejemplo, `translationKey`, `messageKey`, o un equivalente),
pero la regla no cambia:

> La identidad del recurso no debe confundirse con la identidad del mensaje.
> La traducción debe resolverse por una clave estable y semánticamente clara.

La clave de traducción debe ser independiente de rutas, slugs, IDs de contenido
u otros datos que puedan cambiar sin que cambie el significado del mensaje.

## Rol dentro del sistema i18n

Este ADR es deliberadamente agnóstico a la implementación concreta y se
complementa con las decisiones de diseño de dominio y routing:

- ADR 001 define la resolución de rutas y aliases de secciones.
- ADR 007 define la identidad del contenido y sus invariantes por locale.
- ADR 011 define la identidad semántica del texto traducible.

La intención es que cada ADR responda a una pregunta distinta y no solape
responsabilidades.

## Implementación

La adopción de una llave canónica de traducción implica:

- mantener una clave estable y semántica para cada mensaje traducible,
- separar esa clave de la identidad del recurso o de la URL,
- usar esa clave como contrato de referencia en plantillas, contenido y
  validaciones,
- y permitir que la implementación concreta cambie sin alterar la regla de
  diseño.

La norma es conceptual: la forma exacta del campo puede cambiar, pero el
principio de separación semántica no.

## Consecuencias

### Positivas

- Reduce ambigüedad semántica entre contenido, rutas y traducciones.
- Mejora la claridad de modelos, plantillas y validaciones.
- Hace más robusta la evolución del contenido y de la i18n.
- Mantiene la decisión válida aunque cambie el nombre técnico del campo.

### A tener en cuenta

- Requiere una adopción consistente en contenidos y plantillas.
- No reemplaza la identidad del dominio; complementa la decisión de negocio del
  contenido con una convención semántica de traducción.
- La regla debe mantenerse estable aunque la implementación técnica cambie.

## Referencias

- [ADR 001](./001-i18n-router-framework.md) — resolución de rutas y aliasing de secciones.
- [ADR 007](./007-domain-i18n-unificacion.md) — identidad del contenido y locales.
- [ADR 010](./010-plantilla-estandar-adr.md) — plantilla estándar de ADRs.
