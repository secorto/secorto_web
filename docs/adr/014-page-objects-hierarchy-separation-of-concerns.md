---
title: ADR 014: Jerarquía de Page Objects con separación clara de responsabilidades
status: accepted
date: 2026-07-20
categories:
  - Testing
  - Architecture
---

## Contexto

La suite E2E de tests utilizaba una clase `ContentListPage` que **mezclaba tres responsabilidades distintas**:
visión de lista, visión de detalle y filtrado por tags. Esto generaba:

1. **Violación del SRP**: una única clase hacía múltiples cosas
2. **Confusión de contextos**: en `BlogPages.ts`, `userInBlogPost()` retornaba `ContentListPage`
   pero navegaba a una página de **detalle** — el tipo no reflejaba la intención
3. **Falta de jerarquía**: todos los Page Objects tenían la misma interfaz sin diferenciar
   su propósito (lista vs detalle vs filtrado)
4. **Propiedades innecesarias**: métodos de detalle en lista, métodos de filtrado en detalle,
   propiedades de comentarios en lista

```text
ContentListPage (original) ❌
├── Vista de LISTA
│   ├── shouldHaveListHeaderTitle()
│   ├── filterByTag()
│   └── ...
├── Vista de DETALLE
│   ├── shouldHaveDetailTitle()
│   ├── shouldHaveComments()
│   ├── shouldHaveRole()
│   └── ...
└── Vista de TAGS (Filtrado)
    └── ...
```

Esta mezcla dificultaba:

- Descubrir qué métodos usar en cada contexto (confusión de IDE)
- Agregar nuevas especializaciones sin contaminar la clase base
- Mantener tests claros: el tipo de retorno no comunicaba intención

## Decisión

Implementar una **jerarquía de Page Objects basada en especialización de responsabilidades**.
Cada clase representa un contexto/vista específico.

**Estructura genérica**:

1. **Base compartida**
   - Propiedades comunes a todos los contextos (ej: encabezado, tags)
   - Métodos transversales aplicables en cualquier contexto (ej: navegar a tag)

2. **Especialización: Vista de Lista**
   - Responsabilidad única: representar lista navegable
   - Métodos: listar items, filtrar, navegar a item
   - Propiedades: selectores para items y filtros

3. **Especialización: Vista de Detalle (con comentarios)**
   - Responsabilidad única: representar vista de detalle de recurso con sección de comentarios
   - Métodos: validar contenido, interactuar con comentarios

4. **Especialización: Vista de Detalle (con metadata profesional)**
   - Responsabilidad única: representar vista de detalle con información profesional (rol, responsabilidades, links)
   - Métodos: validar metadata específica

5. **Especialización: Filtrado por Tags**
   - Responsabilidad única: representar vista filtrada por criterio
   - Métodos: filtrar, navegar, validar resultados filtrados

```text
Base Compartida ✅
│
├── Vista de Lista
├── Vista de Detalle (Comentarios)
├── Vista de Detalle (Metadata)
└── Vista de Filtrado
```

**Principio**: Cada clase tiene UNA responsabilidad clara. El tipo de retorno en tests
comunica exactamente qué contexto se está probando.

## Motivación

- **Type Safety en tests**: cada especialización es un tipo distinto, compiler valida
  disponibilidad de métodos en compile-time
- **Claridad de intención**: el tipo de retorno comunica exactamente qué contexto se prueba
- **Escalabilidad**: nuevas especializaciones se crean extendiendo la base sin contaminar clases existentes
- **Autocompletar mejorado**: IDE sugiere solo métodos relevantes para cada contexto
- **Mantenibilidad**: cada clase tiene una responsabilidad clara y pequeña (SRP)
- **Legibilidad de tests**: el tipo de Page Object actúa como documentación implícita

## Alternativas consideradas

1. **Mantener una única clase genérica con métodos opcionales**
   - Rechazada: genera confusión, complicaciones en documentación, sin validación en compile-time

2. **Usar una mega-interfaz con métodos parcialmente implementados**
   - Rechazada: máscara de SRP, difícil de mantener

3. **Usar composición de mixins en lugar de herencia**
   - Considerada: más flexible, pero más compleja; especializaciones simples son suficientes

## Consecuencias

### Positivas

- ✅ **Separación clara de responsabilidades**: cada clase representa un contexto único
- ✅ **Mejor navegación en IDE**: autocompletar muestra solo métodos válidos para cada contexto
- ✅ **Seguridad de tipos**: compiler valida disponibilidad de métodos en compile-time
- ✅ **Documentación explícita mediante tipos**: el tipo de Page Object comunica el contexto
- ✅ **Mantenibilidad**: cambios en una especialización no afectan otras
- ✅ **Escalabilidad**: patrón replicable a otros Page Objects del proyecto

### Negativas

- ⚠️ Más clases: una clase por especialización (lista, detalle, filtrado, etc.)
- ⚠️ Requiere actualizar helpers/factories para retornar tipos correctos

### Neutras

- El patrón es independiente de nombres concretos, aplicable en cualquier dominio

## Implementación realizada

**Mapeo concreto** (en `tests/support/ui/content/`):

| Objetivo Abstracto | Implementación Concreta | Responsabilidad |
| --- | --- | --- |
| Base compartida | `ContentPage.ts` | Propiedades comunes (`name`, `headerTitle`, `tags`); métodos transversales (`shouldHaveHeaderTitle`, `clickTag`) |
| Vista de Lista | `ContentListPage.ts` | Listar items, filtrar, navegar |
| Vista de Detalle (Comentarios) | `ContentPostDetailPage.ts` | Validar contenido, interactuar con comentarios (blogs, talks) |
| Vista de Detalle (Metadata) | `ContentExperienceDetailPage.ts` | Validar metadata profesional (rol, responsabilidades, links) |
| Vista de Filtrado | `ContentTagsPage.ts` | Filtrar por tags, navegar, validar resultados |

**Actualización de helpers**: `BlogPages.ts`, `WorkPages.ts`, `TalkPages.ts`, etc. retornan tipos específicos.

Cada método incluye JSDoc explicando su responsabilidad, parámetros y comportamiento esperado.

## Referencias

- [PAGE_OBJECTS.md](../architecture/PAGE_OBJECTS.md) — referencia de arquitectura E2E
  con modelo genérico Component/Page/Flow
- [TESTING_STRATEGY.md](../architecture/TESTING_STRATEGY.md) — estrategia general de testing E2E
