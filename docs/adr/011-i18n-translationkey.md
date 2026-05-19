---
title: ADR 011: `translationKey` como llave canónica
status: accepted
date: 2026-05-18
last_updated: null
categories:
  - Architecture
  - i18n
  - Domain
supercedes:
  - 007
---

## Resumen

Este ADR formaliza una única decisión: `translationKey` es la llave canónica para mensajes
de UI y contenido. El alcance es restringido: sustituye la recomendación específica de ADR 007
que proponía usar `postId` como llave de traducción — 011 reemplaza exclusivamente ese punto.

Nota: ADR 011 reemplaza parcialmente a ADR 007 únicamente en el punto de la llave de
traducción (reemplazo `postId` → `translationKey`); el resto de las mecánicas descritas en
ADR 007 (normalización de objetos `domain`, `localeLinks`, APIs SEO, etc.) permanecen vigentes.

## Decisión

Adoptar `translationKey` como identificador canónico de mensajes de UI y contenido. No usar IDs
de recurso (`postId`) como llave de traducción.

## Razonamiento

- Separar identidad de recurso (p. ej. `id`, `postId`) de la identidad de mensaje mejora el
  reuso y evita acoplamientos semánticos entre contenido y texto.
- `translationKey` es estable ante cambios de ruta/slug y facilita la gestión de catálogos.

## Migración mínima

1. Reemplazar los casos donde `postId` se usaba como key de traducción por `translationKey`.
2. Añadir validación (Zod) en la capa de contenido que exija `translationKey` cuando aplique.
3. Actualizar plantillas/editores para exponer `translationKey` a redactores; migrar contenido
   progresivamente.

## Alcance explícito

- Sustituye únicamente la recomendación de `postId` en ADR 007 por `translationKey`.
- No modifica otras decisiones de ADR 007 (p. ej. normalización de objetos de dominio o
  la arquitectura del router); esos puntos permanecen en ADR 007.

## Aprobación

Firmado por el equipo de i18n / mantenedores del repositorio.

## Problemas detectados

- Mezcla semántica entre identidad de recurso e identidad de mensaje cuando se usan IDs de
  recurso como keys de traducción.
- Dificultad para reutilizar textos compartidos entre tipos de contenido.
- Dependencia de las pruebas en `i18n/ui.ts` como fuente de verdad, lo que exige estabilidad de
  las keys.

## Decisión

Adoptar `translationKey` como identificador canónico de mensajes de UI y contenido. No usar IDs
de recurso como llave de traducción.

Razonamiento breve:

- Desacopla recurso y mensaje, facilitando reuso y composición.
- Facilita la gestión de catálogos de traducción y la caché por clave/locale.
- Mejora la fiabilidad de pruebas al usar keys estables como fuente de verdad.

## Análisis

### Alternativas evaluadas

- Usar ID de recurso: sencillo pero semánticamente incorrecto y limitante.
- Usar `slug`/ruta: expone la i18n a cambios de URL y SEO.
- `translationKey`: solución semántica, estable y reutilizable (decisión).

### Impacto en el dominio

- Mantener `id` de recurso para referencias internas; exponer `translationKey` para la UI.
- Ajustes menores en `domain/*` para propagar `translationKey` donde importe.

### Integración con `i18n/ui.ts` y pruebas

- `i18n/ui.ts` permanece como fuente de verdad en pruebas.
- No mockear `i18n/ui.ts` en pruebas unitarias; en su lugar garantizar la presencia y estabilidad
  de las keys mediante validaciones en build/CI.

### Migración y compatibilidad

- No se realizará un mapeo automático implícito desde identificadores legacy. La adopción de
  `translationKey` será controlada mediante actualizaciones en origen y soporte en plantillas/CMS.
- Implementar validación Zod en la capa de contenido que rechace identificadores legacy y exija
  `translationKey` cuando corresponda; activar dicha validación en la pipeline de CI.

## Pruebas y cobertura

- Mantener `i18n/ui.ts` como fuente de verdad en pruebas unitarias; las pruebas deben usar
  keys y valores reales.
- Añadir validación Zod en `content.config` (u equivalente) que impida el uso de identificadores
  legacy y obligue a `translationKey` en frontmatter relevante.
- Pruebas unitarias: verificar que las keys consumidas por componentes existan en `i18n/ui.ts`.
- Pruebas E2E: comprobar renderizado por locale y fallback; no basar aserciones en IDs internos.

## Consecuencias

Positivas:

- Mayor robustez frente a migraciones y reindexaciones.
- Reuso de traducciones entre entidades.
- Mejora en fiabilidad y cobertura de pruebas.

Costos:

- Trabajo de adopción (frontmatter, plantillas, CMS) y actualización de contenido legado.

## Plan de migración

1. Añadir campo `translationKey` en objetos/plantillas donde proceda.
2. Implementar validación Zod en la capa de contenido que rechace identificadores legacy y exija
   `translationKey` cuando aplique; activar en CI.
3. Actualizar plantillas de edición y CMS para exponer `translationKey` a redactores.
4. Ejecutar pruebas unitarias y E2E, cubrir gaps en `i18n/ui.ts`.
5. Eliminar usos de identificadores internos en la UI una vez la cobertura y la adopción sean
   satisfactorias.

## Revisión y seguimiento

- Este ADR sustituye y complementa las decisiones de ADR 001 y ADR 007; consultarlo en cambios
  futuros de i18n o dominio.
- Añadir comprobaciones de PR que verifiquen la presencia de `translationKey` para nuevos usos de
  texto en UI.

## Aprobación

Firmado por el equipo de i18n / mantenedores del repositorio.
