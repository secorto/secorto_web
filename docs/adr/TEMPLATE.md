---
id: ADR-XXX
title: Título breve de la decisión
status: proposed
date: YYYY-MM-DD
last_updated: YYYY-MM-DD
categories:
  - Architecture
---

## Contexto

Describe el problema, la necesidad o la tensión que motivó la decisión.

Debe mantenerse en un nivel abstracto y conceptual. No incluyas nombres de clases,
archivos, rutas ni detalles de implementación concreta. Esa parte va en la documentación de
arquitectura o en anexos técnicos.

## Objetivo

Explica qué se quiere resolver, qué criterio guía la decisión o qué objetivo debe cumplirse.

## Decisión

Define la decisión adoptada en términos conceptuales y de patrón arquitectónico.

Ejemplos válidos:

- especialización por responsabilidad
- separación clara entre dominio y presentación
- patrón de rutas con un punto de entrada semántico
- regla de gobernanza editorial única

No conviertas el ADR en una descripción de la implementación actual. Los detalles de
mapeo a clases, archivos o servicios concretos deben vivir en documentos de arquitectura o anexos.

## Motivación

Explica la razón de fondo, la presión que originó la decisión y, si aporta valor, compara el
estado anterior con el objetivo deseado.

Puede incluir:

- una lista breve de factores desencadenantes
- una tabla de comparación antes/después
- una explicación del problema raíz

## Implementación

Describe cómo se aplica la decisión en el proyecto sin entrar en detalles técnicos concretos de
clases o archivos.

Puedes enlazar a la documentación de arquitectura o a anexos donde se detallen:

- decisiones de diseño específicas
- guías de migración
- diagramas o evidencia técnica
- pasos de aplicación

## Consecuencias

### Positivas

- Beneficio principal de la decisión
- Mejora de claridad, mantenibilidad, escalabilidad o gobernanza
- Reducción de complejidad o duplicación

### A considerar

- Costes, riesgos, condiciones de uso o disciplina necesaria
- Trabajos pendientes o mantenimiento requerido
- Dependencias de adopción o coordinación

### Contras (Trade-offs)

- Desventajas reales o compromisos inherentes a la decisión
- Limitaciones que conviene documentar explícitamente

### Alternativas Rechazadas

#### Opción 1

Describe la alternativa y el motivo por el que fue descartada.

#### Opción 2

Describe la alternativa y el motivo por el que fue descartada.

## Referencias

- [ARCHITECTURE.md](../ARCHITECTURE.md) — Principios y orientación arquitectónica del proyecto
- [TESTING_STRATEGY.md](../architecture/TESTING_STRATEGY.md) — Estrategia de pruebas y validación

## Anexos

- [Nombre del anexo](ruta/al/anexo.md) — detalle técnico, guía de implementación o evidencia adicional
