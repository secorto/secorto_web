---
title: ADR 003 - Mocks de servicios de terceros en tests E2E
status: accepted
date: 2025-07
last_updated: 2026-07-20
categories:
  - Testing
  - Performance
  - Architecture
---

## Contexto

Los tests E2E cargan contenido de terceros (videos, presentaciones embebidas,
componentes de comentarios) que generan problemas de rendimiento y confiabilidad:

1. **Lentitud:** esperar la descarga de recursos pesados ralentiza la suite
   significativamente.
2. **Flakiness:** dependencia de disponibilidad de servicios externos causa
   fallos intermitentes en CI por timeouts de red.
3. **No-determinismo:** cambios no controlados en servicios externos rompen
   aserciones de tests.

## Decisión

Interceptar peticiones a servicios de terceros con herramientas de intercepción
de red (como `page.route()` en Playwright) y devolver mocks livianos que
satisfacen la estructura esperada por el DOM sin descargar recursos reales.

### Caraterísticas clave

- **Registro condicional**: los mocks pueden activarse/desactivarse mediante
  variables de entorno para permitir validación con servicios reales cuando
  sea necesario.
- **Composición modular**: cada mock es independiente y se pueden registrar
  en paralelo.
- **Registro temprano**: interceptación configurada antes de navegación para
  evitar condiciones de carrera.
- **Verificación pragmática**: los tests verifican que estructuras esperadas
  estén presentes, no contenido de iframes cross-origin.

## Razonamiento

- **Velocidad mejorada**: eliminar descarga de recursos pesados acelera
  ejecución de tests significativamente.
- **Determinismo**: mocks libres de dependencias externas hacen tests
  predecibles y reducen flakiness en CI.
- **Flexibilidad**: permitir activar servicios reales mantiene opción de
  validación de integración cuando sea necesario.
- **Modularidad**: mocks independientes son fáciles de extender y mantener

## Consecuencias

### Positivas

- Suite de tests más rápida y confiable
- Reducción significativa de fallos intermitentes en CI
- Fácil de extender a nuevos servicios sin duplicar lógica
- Mantiene opción de validación de integración real

### Consideraciones

- Los mocks no validan cambios en APIs de servicios externos; requiere
  ejecución periódica con servicios reales para detectar roturas
- Costo inicial de implementación de cada mock

## Referencias

- Para detalles técnicos, código, benchmarks y estructura de tests:
  ver [anexos/003-third-party-mocks/IMPLEMENTATION_AND_BENCHMARKS.md](../anexos/003-third-party-mocks/IMPLEMENTATION_AND_BENCHMARKS.md)
- [ADR 002: Migración de Cypress a Playwright + Vitest](./002-testing-framework-migration.md)
- [Playwright: Network routing](https://playwright.dev/docs/network#modify-requests)
