---
title: ADR 011: `translationKey` como llave canónica
status: accepted
date: 2026-05-18
last_updated: 2026-05-21
categories:
  - Architecture
  - i18n
  - Domain
supersedes:
  - 007
---

## Contexto

ADR 007 proponía usar `postId` como llave de traducción. Durante la discusión
se identificó confusión semántica entre identificadores de recurso y llaves de
traducción; además, mezclar responsabilidades puede provocar duplicidad y errores
al migrar contenidos.

## Decisión

Adoptar `translationKey` como la llave canónica para todos los mensajes de UI y
contenido. No se mantendrá compatibilidad automática con `postId` como llave de
traducción: evitar la coexistencia de dos identificadores actuando como clave
previene duplicidad y ambigüedad.

## Justificación

- Claridad: `translationKey` expresa explícitamente su propósito y reduce
  ambigüedad en frontmatter y plantillas.
- Riesgo reducido: no mezclar identidad de recurso y de mensaje evita
  conflictos semánticos cuando cambian rutas o IDs internos.

Nota: técnicamente `postId` podría funcionar si se mantiene estable, pero la
decisión prioriza un contrato semántico claro entre contenido y traducciones.

## Consecuencias

- Positivas:
  - Mejora la claridad semántica del modelo de contenido.

- Costos:
  - Trabajo de adopción en plantillas, editores y posible migración de contenido.

## Migración (alcance y plan)

Al validar el repo, `translationKey` aparece actualmente en 2 posts (4 archivos):

- `src/content/blog/es/2026-04-25-mis-primeros-pasos-en-linux.md`
- `src/content/blog/en/2026-04-25-my-first-steps-in-linux.md`
- `src/content/blog/es/2026-04-23-como-uso-linux-hoy.md`
- `src/content/blog/en/2026-04-23-how-i-use-linux-today.md`

Dado el alcance limitado, la migración se realizará como un cambio atómico

1. Verificar y consolidar `translationKey` en los 4 archivos listados (asegurar
  que el valor es correcto y consistente entre locales).
2. Actualizar plantillas/editores si procede para exponer y favorecer
  `translationKey` en nuevos contenidos.
3. Ejecutar la suite de pruebas y `tsc --noEmit`; corregir cualquier fallo.
4. Habilitar en CI una verificación (p. ej. script `check-translation-keys`) que
  valide la presencia/consistencia de `translationKey` en los posts críticos.
5. Documentar la operación en el changelog/PR y cerrar la migración.

Nota: no es necesario ahora mantener `postId` como llave de traducción; el cambio
se aplica de forma dirigida y atómica sobre los posts afectados.

## Alcance

- Este ADR formaliza únicamente la llave canónica de traducción. Las políticas
  operativas de testing, validación y uso de `i18n/ui.ts` se documentarán en un
  ADR separado.

## Aprobación

Firmado por el equipo de i18n / mantenedores del repositorio.
