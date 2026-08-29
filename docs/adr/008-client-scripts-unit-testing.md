---
id: ADR-008
title: Estrategia de pruebas client-side y reorganización del cliente
status: accepted
date: 2026-04-02
last_updated: 2026-08-26
categories:
  - Testing
  - Architecture
---

## Contexto

El sistema incluye lógica ejecutada en el cliente que interactúa con el DOM, gestiona preferencias del usuario
y controla elementos de la interfaz.
Históricamente, gran parte de esta lógica residía en estructuras de presentación y se validaba principalmente
mediante pruebas end‑to‑end, lo que generaba:

- Cobertura insuficiente en escenarios específicos del cliente.
- Dependencia excesiva en pruebas integradas para validar comportamientos simples.
- Dificultad para aislar y probar estados, inicialización y preferencias.
- Acoplamiento entre la lógica del cliente y las estructuras de presentación.

Para mejorar la confiabilidad y la mantenibilidad, se requiere una estrategia de pruebas más granular
y una reorganización del código cliente.

## Objetivo

Establecer una estrategia de pruebas determinista para la lógica client‑side y reorganizar el código
en módulos dedicados que permitan aislar responsabilidades y facilitar su validación.

## Decisión

1. Priorizar una estrategia de pruebas client‑side basada en la ejecución de lógica de manipulación del DOM
  en un entorno simulado.
2. Reorganizar el código cliente en módulos dedicados, separando responsabilidades como manejo de preferencias,
  control de elementos interactivos y lógica de inicialización.
3. Definir APIs explícitas para cada módulo, facilitando su testabilidad y reduciendo el acoplamiento
  con las estructuras de presentación.
4. Validar la lógica del cliente mediante pruebas unitarias que cubran inicialización, estados por defecto,
  preferencias del usuario y comportamiento observable.
5. Minimizar la lógica inline en las estructuras de presentación y delegar la inicialización a módulos dedicados.

## Implementación

La implementación concreta se documenta en los archivos de arquitectura correspondientes.
Conceptualmente, la decisión implica:

- Crear una estructura dedicada para módulos client‑side.
- Extraer la lógica de interacción con el DOM desde las estructuras de presentación hacia módulos aislados.
- Definir una API pública mínima para cada módulo, centrada en comportamiento observable.
- Ejecutar pruebas unitarias en un entorno simulado que permita validar la manipulación del DOM
  sin depender de un navegador real.
- Reducir la lógica inline y delegar la inicialización a módulos explícitos para mejorar control y testabilidad.

## Consecuencias

### Positivas

- Pruebas unitarias rápidas y deterministas para la lógica client‑side.
- Reducción de la dependencia en pruebas end‑to‑end para validar comportamientos simples.
- Código más modular y mantenible gracias a la separación de responsabilidades.
- Mayor claridad en la API pública de los módulos del cliente.
- Cobertura más completa de escenarios como inicialización, preferencias del usuario y estados por defecto.

### A tener en cuenta

- La reorganización incrementa la superficie de código y requiere disciplina para mantener APIs pequeñas y bien documentadas.
- La estrategia de pruebas requiere mantener actualizado el entorno simulado y las dependencias de desarrollo.
- La modularización implica mantener coherencia entre los módulos y las estructuras de presentación.
