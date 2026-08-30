---
id: ADR-007
title: Unificación de dominio e i18n
status: accepted
date: 2026-03-24
last_updated: 2026-08-29
categories:
  - Architecture
  - i18n
  - Domain
---

## Contexto

El sistema de contenido localizado requería una regla clara para determinar cuándo varias entradas
representan la misma entidad en distintos idiomas. Sin una identidad canónica del contenido, nociones
como URL, locale, SEO y traducción terminaban mezclándose en distintas capas, generando decisiones
implícitas y estados ambiguos durante el build.

## Objetivo

Definir un modelo de dominio que establezca una identidad única para cada entidad de contenido y que
trate los locales como variantes explícitas de esa identidad, manteniendo una separación estricta
entre dominio, routing y traducción.

## Decisión

El dominio debe definir una **identidad canónica del contenido**, independiente del idioma, que
agrupa todas las variantes localizadas de una misma entidad.

El `locale` es un **atributo estructural de la entrada localizada**: no forma parte del contenido en
sí, pero sí forma parte de la identidad de la variante. Una entrada localizada se identifica por la
combinación de:

- **identidad canónica del contenido**, y
- **locale**.

El modelo establece las siguientes invariantes:

1. Todas las variantes de una entidad comparten una identidad canónica común.
2. El `locale` es parte fundamental de la identidad de la variante localizada.
3. La relación entre identidad y locales es una responsabilidad del dominio, no del routing ni de la
   traducción.
4. Las inconsistencias de identidad (como duplicados de identidad por locale) se consideran
   violaciones de invariantes del dominio.

## Rol dentro del sistema i18n

Este ADR define **qué constituye la misma entrada** en distintos locales y cómo se identifican sus
variantes.

- **ADR‑001** define **cómo se navega hacia esa entrada** y cómo el locale participa en la unicidad
  de las rutas.
- **ADR‑011** define **cómo se identifica un mensaje dentro de esa entrada**, donde la identidad del
  mensaje se expresa como `(translationKey, locale)`.

Cada capa mantiene su responsabilidad: identidad del contenido, navegación y traducción.

## Implementación

La implementación concreta se documenta en el anexo técnico correspondiente.

## Consecuencias

### Positivas

- Identidad del contenido unificada y explícita.
- Variantes localizadas definidas por identidad + locale.
- Separación clara entre dominio, routing y traducción.
- Reducción de decisiones implícitas en SEO y generación de enlaces.
- Mayor robustez del build al detectar inconsistencias de forma temprana.

### A tener en cuenta

- Puede requerir ajustes en contenido legacy.
- Los consumidores del dominio deben tratar la identidad canónica y el locale como contrato
  explícito.
- No modifica la semántica de la clave de traducción; cada capa mantiene su rol.

## Referencias

- [ADR 001](./001-i18n-router-framework.md)
- [ADR 011](./011-i18n-translationkey.md)

## Anexos

- [Implementación](./anexos/007-domain-i18n-unificacion/IMPLEMENTATION.md)
