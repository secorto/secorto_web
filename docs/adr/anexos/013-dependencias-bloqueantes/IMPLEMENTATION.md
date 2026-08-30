# Implementación — Caso ESLint (2026)

Este documento registra la aplicación de
**ADR‑013 — Manejo de dependencias externas que bloquean la evolución del sistema**
durante la actualización del núcleo del sistema de análisis estático en 2026.

## Contexto específico

Durante la actualización del núcleo del linter, dos dependencias externas no ofrecían compatibilidad
con la nueva versión. La falta de actualización impedía:

- aplicar mejoras críticas del core,
- mantener compatibilidad con el toolchain moderno,
- reducir deuda técnica acumulada,
- estabilizar el pipeline de CI.

## Acción tomada

Siguiendo ADR‑013, se decidió **desactivar las dependencias bloqueantes** para permitir la actualización del núcleo.
 La acción fue puntual y se limitó al ciclo de migración.

## Detalles técnicos

- Se identificaron extensiones externas que impedían la migración.
- Se desactivaron temporalmente para completar la actualización.
- Se complementó con validaciones internas y pruebas automatizadas.
- No se estableció ninguna obligación futura de reincorporación.

## Evidencia

- PRs estancados desde febrero de 2026.
- Bloqueo directo de la actualización del core.
- Fricción en PRs y en el pipeline de CI.
- Compatibilidad restaurada tras la desactivación.

## Estado actual

La migración del núcleo se completó exitosamente.
Las dependencias desactivadas permanecen fuera del toolchain mientras se evalúan alternativas o versiones compatibles.

Este documento sirve como registro histórico de la aplicación de ADR‑013.
