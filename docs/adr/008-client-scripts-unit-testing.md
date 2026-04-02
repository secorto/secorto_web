# ADR 008: Estrategia de pruebas client-side y reorganización del cliente

> **Estado:** Aceptada
> **Fecha:** 2026-04-02
> **Categoría:** Testing / Arquitectura cliente
---

## Contexto

El cambio principal es la adopción de una **estrategia de pruebas
client-side**: habilitar y consolidar tests unitarios que ejerciten la
manipulación del DOM en módulos cliente usando `jsdom` y `vitest`.
Como consecuencia de esta decisión se reorganizó el código cliente:
se creó `src/client/` y se extrajeron responsabilidades (por ejemplo
`themeToggle` y `giscus`) desde los layouts hacia módulos dedicados; el
script inline en el layout se redujo y se añadieron tests unitarios
(`tests/unit/themeToggle.test.ts`) que cubren escenarios de `localStorage`
y preferencias del sistema.

Antes de este cambio las comprobaciones de comportamiento del toggle se
realizaban principalmente mediante e2e (Playwright) y algunos tests de humo;
esto dejaba escenarios sin cobertura clara (conditions/race, fallback de
preferencias, edge cases de `localStorage`) y dependía de widgets
externos (p. ej. giscus) en pruebas integradas.

## Decisión

1. Priorizar la estrategia de pruebas client-side: habilitar `jsdom` y
  `vitest` para cubrir de forma determinista la lógica que interactúa
  con el DOM en módulos cliente.
2. Reorganizar el código cliente: crear `src/client/` y extraer
  responsabilidades (por ejemplo `themeToggle`, `giscus`) a módulos
  dedicados.
3. Usar `jsdom` en entorno de pruebas para permitir tests unitarios del
   comportamiento DOM sin abrir un navegador real.
4. Escribir tests unitarios que cubran: inicialización, lectura/escritura
   de `localStorage`, detección de preferencias del sistema, manejo de
   estados por defecto y API pública mínima del módulo.
5. Minimizar el script inline en el HTML y cargar la lógica no crítica de
   forma diferida (lazy) cuando sea posible.

## Motivación

- Incrementar la cobertura y confiabilidad: los tests unitarios son más
  deterministas y rápidos que e2e para comprobar lógica de manipulación
  DOM aislada.
- Reducir dependencias incidentales en e2e: al poder mockear `giscus`
  y otros terceros, las pruebas unitarias evitan falsos negativos.
- Mejorar mantenibilidad: un módulo con API pequeña y testeable facilita
  refactors y evita que cambios en layout rompan la lógica del toggle.
- Rendimiento: script inline reducido mejora TTI y facilita caching.

## Alternativas consideradas

- Mantener toda la lógica en el layout y probar con e2e únicamente —
  Rechazada: pruebas e2e eran frágiles y no cubrían todos los edge cases.
- Usar un headless browser en todos los tests unitarios — Rechazada:
  más lenta y menos conveniente en CI comparado con `jsdom` para pruebas
  de manipulación DOM simple.

## Consecuencias

### Positivas

- Tests unitarios rápidos y deterministas para la mayor parte de la
  lógica del toggle.
- Menor número de pruebas e2e necesarias; e2e se reserva para flujos
  integrales y contratos con terceros.
- Código más modular y reusable (`src/client/themeToggle.ts`).

### Negativas / Costes

- Mayor superficie de código: más archivos y responsabilidades claras que
  mantener.
- Configuración de CI y dependencias dev (`jsdom`, `vitest`) para
  mantener actualizadas.
- Necesidad de disciplina en mantener la API pública mínima y la
  documentación para evitar duplicación.

## Autor

Equipo de desarrollo — @secorto
