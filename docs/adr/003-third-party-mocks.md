---
id: ADR-003
title: Mocks de servicios de terceros en tests E2E
status: accepted
date: 2026-01-01
last_updated: 2026-08-29
categories:
  - Testing
  - Performance
  - Architecture
---

## Contexto

El sistema integra múltiples servicios de terceros para funcionalidades como reproducción de video,
visualización de presentaciones y comentarios embebidos.
Estos servicios se cargan mediante recursos externos que dependen de disponibilidad, latencia y comportamiento del proveedor.

En la suite de pruebas end‑to‑end, esta dependencia generaba problemas recurrentes:

- **Lentitud:** las pruebas esperaban la carga de recursos pesados provenientes de proveedores externos.
- **Flakiness:** fallos intermitentes causados por timeouts, variaciones de red o indisponibilidad temporal.
- **No‑determinismo:** contenido dinámico o cambiante en iframes externos afectaba la estabilidad de las aserciones.

Para garantizar pruebas deterministas y rápidas, se requiere desacoplar la suite E2E de la carga real de estos servicios.

## Objetivo

Asegurar que las pruebas end‑to‑end sean rápidas, deterministas y libres de dependencias externas,
manteniendo la capacidad de validar la integración real cuando sea necesario.

## Decisión

Interceptar las solicitudes hacia servicios de terceros durante la ejecución de pruebas end‑to‑end
y sustituirlas por respuestas controladas y livianas que simulen la estructura mínima esperada por el sistema.

La integración real con proveedores externos queda fuera del alcance de las pruebas E2E regulares
y puede validarse en ejecuciones específicas dedicadas.

## Implementación

La implementación concreta se documenta en los archivos de arquitectura correspondientes.
Conceptualmente, la decisión implica:

- Definir un mecanismo centralizado para interceptar solicitudes a servicios externos.
- Proveer respuestas simuladas que representen la estructura mínima necesaria para que el sistema funcione.
- Permitir un modo alternativo donde las pruebas utilicen los servicios reales para validaciones completas.
- Mantener la lógica de mocks aislada y extensible para incorporar nuevos proveedores sin afectar la suite principal.

## Consecuencias

### Positivas

- **Velocidad:** las pruebas se ejecutan significativamente más rápido al evitar la carga de recursos externos.
- **Determinismo:** las pruebas dejan de depender de la disponibilidad o variabilidad de servicios de terceros.
- **Mantenibilidad:** agregar un nuevo proveedor requiere únicamente definir su comportamiento simulado.
- **Flexibilidad:** se habilita un modo de ejecución que permite validar la integración real cuando sea necesario.

### A tener en cuenta

- Las pruebas con mocks no detectan cambios reales en APIs o estructuras de proveedores externos.
- Se recomienda ejecutar periódicamente una suite contra servicios reales para detectar roturas de integración.

## Referencias

- [Playwright: Network — `page.route()`](https://playwright.dev/docs/network#modify-requests)
- [Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications) — Kent C. Dodds
- [docs/GISCUS.md](../GISCUS.md) — Integración y helpers para el widget de comentarios
- [docs/TESTING_STRATEGY.md](./TESTING_STRATEGY.md) — Estrategia general de testing del proyecto

## Anexos

- [Implementación](anexos/003-third-party-mocks/IMPLEMENTATION.md)
