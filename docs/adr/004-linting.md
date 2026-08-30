---
id: ADR-004
title: Linting y análisis estático como garantía de calidad estructural
status: accepted
date: 2026-02-15
categories:
  - Tooling
  - Code Quality
  - Static Analysis
---

## Contexto

El proyecto ha crecido en complejidad y volumen. Los refactorings orientados a cobertura total
expusieron problemas estructurales: tipos débiles, inconsistencias semánticas y errores silenciosos
que solo emergían en runtime o durante la ejecución de tests.

Esta situación hacía difícil sostener la evolución del código y comprometía la confiabilidad del CI.

## Decisión

Establecer un sistema de **análisis estático estricto** como mecanismo central de calidad de código,
con reglas que:

- refuercen el tipado fuerte,
- prevengan dependencias implícitas o imports inválidos,
- garanticen criterios mínimos de accesibilidad,
- mantengan coherencia semántica en todo el repositorio.

El linting pasa a ser un **gate obligatorio** del pipeline y un componente esencial del diseño del
ecosistema.

## Motivación

- Asegurar que los errores estructurales se detecten antes de ejecutar tests o desplegar.
- Reducir la variabilidad introducida por herramientas, generadores y contribuciones externas.
- Mantener un estándar uniforme que permita refactorizar sin degradar la base de código.
- Convertir el análisis estático en una capa de defensa que complemente el tipado y el CI.

## Consecuencias

### Positivas

- Mayor robustez del código y reducción de errores silenciosos.
- Base semántica consistente que facilita refactorings y modularización.
- Pipeline más confiable al detectar fallos antes de la ejecución de tests.
- Ecosistema alineado: código humano, código generado y paquetes internos siguen las mismas reglas.

### Consideraciones

- Algunas áreas requerirán excepciones justificadas (por ejemplo, definiciones de tipos).
- La política de análisis estático evolucionará en ADRs posteriores conforme cambie el ecosistema.
- Las decisiones de estilo quedan fuera de este ADR y se documentan en ADR‑012.

## Acciones futuras

- Revisar y ajustar excepciones para mantener la coherencia del sistema.
- Consolidar reglas específicas para archivos de definición y paquetes internos.
- Mantener este ADR como base conceptual; cambios operativos se documentarán en ADR‑013.

## Referencias

- [ADR-012](012-formatting.md) Formateo
- [ADR-013](013-lint-rule-changes.md) Actualización eslint
