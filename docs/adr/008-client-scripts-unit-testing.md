---
title: ADR 008 - Estrategia de pruebas client-side y reorganización del cliente
status: accepted
date: 2026-04-02
last_updated: 2026-07-20
categories:
  - Testing
  - Architecture
---

## Contexto

El proyecto necesitaba mejorar cobertura de lógica client-side que
interactúa con el DOM. Antes, las pruebas se realizaban principalmente
mediante E2E (frágiles, lentas) o no se cubrían escenarios de edge cases
(`localStorage`, preferencias del sistema, race conditions).

---

## Decisión

1. **Priorizar pruebas unitarias client-side:** usar `jsdom` + test runner
   para cubrir lógica de DOM determinísticamente sin abrir navegador real.
2. **Reorganizar código cliente:** extraer responsabilidades discretas
   (toggles de tema, inicialización del sidebar, etc.) a módulos dedicados
   con API explícita y testeable.
3. **Minimizar scripts inline:** cargar lógica no crítica de forma diferida
   para mejorar TTI y cacheabilidad.
4. **Mejorar testabilidad:** API pública mínima por módulo; inicialización
   explícita desde layouts; fácil de mockear en tests.

---

## Razonamiento

- **Velocidad y confiabilidad:** tests unitarios deterministas, sin
  dependencias externas incidentales
- **Cobertura completa:** edge cases (localStorage edge cases, fallbacks,
  race conditions) cubiertos por unidad, no solo E2E
- **Mantenibilidad:** módulos pequeños con responsabilidad clara facilitan
  refactors sin romper comportamiento
- **Rendimiento:** script inline reducido mejora Core Web Vitals

---

## Consecuencias

### Positivas

- Suite de tests unitarios rápida y determinista
- E2E reservado para flujos integrales y validación de contratos externos
- Código modular y reusable
- Menor flakiness en CI

### Consideraciones

- Mayor número de archivos y responsabilidades que mantener
- Dependencias dev (`jsdom`, test runner) para sincronizar
- Requiere disciplina en mantener API pública mínima

## Referencias

Para detalles técnicos, estructura de directorios, ejemplos de tests
client-side, y configuración de `jsdom` con vitest:
ver [anexos/008-client-scripts/IMPLEMENTATION_AND_TESTING.md](../anexos/008-client-scripts/IMPLEMENTATION_AND_TESTING.md)

- [ADR 002: Migración de Cypress a Playwright + Vitest](./002-testing-framework-migration.md)
- [docs/architecture/TESTING_STRATEGY.md](../../architecture/TESTING_STRATEGY.md)
