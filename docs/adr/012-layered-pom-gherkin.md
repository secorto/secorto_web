---
title: ADR 012: Implementación de POM por capas con User Journeys (Given/When/Then)
status: accepted
date: 2026-05-30
categories:
  - Testing
  - Architecture
---

## Contexto

Los page objects del proyecto tendían a crecer mezclando responsabilidades: locators, lógica de navegación,
assertions y setup de estado (storage, mocks). El patrón Screenplay (actor + abilities + tasks/questions)
fue evaluado como referencia. Sus ideas son sólidas, pero su implementación directa introduce
contexto inyectable con tipos débiles donde todo acaba siendo `attempts to`,
y la lógica de setup queda dispersa en lugar de estar encapsulada en el flujo que la necesita.

## Decisión

Adoptar una arquitectura de **tres capas** para los tests E2E:

```text
Page (locators + pasos atómicos)  →  User Journey (flujo + setup)  →  Spec (Given/When/Then)
```

### Capa 1 — Page (`*Page.ts`)

POM de interacción/verificación atómica con dos subtipos:

1) componentes UI atómicos (con `Locator`s y helpers de acceso al DOM),
2) páginas compuestas/orquestadoras que agregan componentes y exponen pasos de más alto nivel.

Por eso una página como `HomePage` puede no declarar locators directos y delegar en componentes.
Los pasos (`shouldHave*`, `shouldBe*`, `click*`, etc.) se encapsulan en `step()` o en
helpers como `Target`.
No contiene setup de escenario (storage/mocks) ni orquestación de flujos de negocio.
Ejemplo: `SidebarPage`, `HomePage`.

### Capa 2 — User Journey (`*UserJourney.ts`)

Encapsula un flujo de usuario concreto y cohesivo.

- Compone uno o más Page Objects y `PageHelper`.
- Expone métodos de flujo de alto nivel fuertemente tipados, componiendo pasos atómicos de Page.
- Incluye un factory (`userIn*`) que orquesta el setup completo
  (navegación, mocks de terceros, inyección de estado inicial) y devuelve el Journey listo para usar.
- Un Journey cubre un flujo; si los métodos divergen significativamente, se crea un Journey separado.
  Ejemplos: `HomeUserJourney` (smoke home) y `ThemeLocaleUserJourney` (flujo tema/locale).

### Capa 3 — Spec (`*.spec.ts`)

Orquesta únicamente con los verbos Gherkin (Given/When/Then/And/But) sobre el objeto
devuelto por el factory del Journey. No contiene locators directos ni lógica de setup.

### Relación con Screenplay y por qué se simplifica

Esta arquitectura recoge las ideas de Screenplay pero las unifica en conceptos más planos:

| Screenplay | Esta arquitectura |
| --- | --- |
| Actor | User Journey (typed, no injectable) |
| Abilities | Composición directa en el constructor del Journey |
| Task / Interaction / Question | `step()` — concepto único |
| Stage / cast | Factory (`userIn*`) |

**`step()` como primitiva unificada:** en Screenplay se distingue entre `Task` (acción),
`Interaction` (acción sobre UI) y `Question` (consulta de estado).
Aquí los tres colapsan en `step()`: un paso que puede devolver `void` (interacción/tarea)
o un valor (consulta). Given/When/Then son agnósticos al tipo de paso; simplemente ejecutan
la definición y devuelven el resultado tipado por TypeScript.

**Por qué no el actor inyectable:** el actor con estado inyectable tiende a tipos débiles
(`any`, retornos genéricos) y obliga a que los tests conozcan detalles del actor para hacer
assertions. El factory del Journey devuelve un tipo concreto con métodos específicos al flujo;
el compilador garantiza que solo se usan los pasos que corresponden.

## Consecuencias

- Positivas:
  - Tests legibles: el spec habla el lenguaje del flujo, no de la implementación.
  - Tipos fuertes por flujo: imposible llamar un método de un Journey que no corresponde al contexto.
  - Setup centralizado: cambiar navegación o mocks solo requiere tocar el factory.
  - Escalabilidad controlada: un Journey que crece demasiado es señal de que el flujo debe dividirse.
- Negativas:
  - Un Journey por flujo implica más archivos; compensado por la claridad de responsabilidades.
  - Para flujos muy simples, la capa intermedia puede parecer sobredimensionada;
    en esos casos puede omitirse el Journey y usar el Page directamente desde el spec.

## Implementación

Este ADR fija la decisión arquitectónica.

Los detalles de implementación (estructura de carpetas, convenciones de nombres, ejemplos y evolución del patrón)
se mantienen en `docs/TESTING_STRATEGY.md` para evitar duplicidad y deriva documental.

Como criterio mínimo de adopción:

1. Mantener el flujo en tres capas: `Page → User Journey → Spec`.
2. Centralizar setup y estado inicial en factories `userIn*` del Journey.
3. Mantener los specs libres de locators directos y de lógica de setup.

## Referencias

- `docs/TESTING_STRATEGY.md`
