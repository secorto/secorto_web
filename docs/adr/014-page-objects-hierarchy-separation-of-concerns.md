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

Implementar una **jerarquía clara basada en patrón Strategy + Template Method**:

1. **ContentPage (base abstracta)**
   - Propiedades comunes: `name`, `headerTitle`, `tags`
   - Métodos comunes: `shouldHaveHeaderTitle()`, `shouldHaveTags()`, `clickTag()`
   - Factory centralizado: `createContentPage()` para elementos compartidos

2. **ContentListPage** (especializada para listas)
   - Extiende `ContentPage`
   - Propiedades: `tagLinks`, `itemLinks`
   - Métodos específicos: `filterByTag()`, `shouldHaveListHeaderTitle()`, `shouldRenderTagsForSection()`

3. **ContentPostDetailPage** (especializada para posts/talks con comentarios)
   - Extiende `ContentPage`
   - Propiedades: `comments` (CommentsComponent)
   - Métodos específicos: `shouldHaveDetailTitle()`, `shouldHaveComments()`

4. **ContentExperienceDetailPage** (especializada para experiencias profesionales)
   - Extiende `ContentPage`
   - Propiedades: `postRole`, `postResponsibilities`, `postWebsite`
   - Métodos específicos: `shouldHaveRole()`, `shouldHaveResponsibilities()`, `shouldHaveWebsite()`

5. **ContentTagsPage** (especializada para vistas filtradas por tags)
   - Estructura similar a `ContentListPage` pero con semántica explícita de filtrado

```text
ContentPage (base) ✅
│
├── ContentListPage
├── ContentPostDetailPage
├── ContentExperienceDetailPage
└── ContentTagsPage
```

## Motivación

- **Type Safety en tests**: el tipo de retorno comunica exactamente qué página se está
  probando; TypeScript detecta en compile-time métodos incorrectos
- **Claridad de intención**: nombres de clase explícitos (`ContentPostDetailPage` vs
  `ContentExperienceDetailPage`) evitan confusión
- **Escalabilidad**: nuevas especializaciones se crean extendiendo la base sin
  contaminar clases existentes
- **Autocompletar mejorado**: IDE sugiere solo métodos relevantes para cada contexto
- **Mantenibilidad**: cada clase tiene una responsabilidad clara y pequeña

## Alternativas consideradas

1. **Mantener una única clase genérica con métodos opcionales**
   - Rechazada: genera confusión, complicaciones en JSDoc, sin validación en compile-time

2. **Usar una mega-interfaz con métodos parcialmente implementados**
   - Rechazada: máscara de SRP, difícil de mantener

3. **Usar composición de mixins en lugar de herencia**
   - Considerada: más flexible, pero más compleja; herencia simple es suficiente aquí

## Consecuencias

### Positivas

- ✅ **Separación clara de responsabilidades**: cada clase tiene un propósito único
- ✅ **Mejor navegación en IDE**: autocompletar muestra solo métodos válidos para cada
  contexto
- ✅ **Seguridad de tipos**: compiler valida disponibilidad de métodos
- ✅ **Documentación explícita**: tipos actúan como documentación ("esta función retorna
  ContentPostDetailPage, por tanto tiene comentarios")
- ✅ **Compatibilidad total**: todos los tests existentes funcionan sin cambios
- ✅ **Mantenibilidad**: cambios en especialización no afectan otras clases

### Negativas

- ⚠️ Más archivos en `tests/support/ui/content/` (ContentListPage.ts, ContentPostDetailPage.ts,
  ContentExperienceDetailPage.ts, ContentTagsPage.ts)
- ⚠️ Requiere actualizar helpers (`BlogPages.ts`, `WorkPages.ts`, etc.) para retornar tipos correctos

### Neutras

- El patrón es replicable a otros Page Objects del proyecto (sidebar, header, etc.)

## Implementación realizada

### Archivos modificados

- `tests/support/ui/content/ContentPage.ts` — clase base
- `tests/support/ui/content/ContentListPage.ts` — especialización lista
- `tests/support/ui/content/ContentPostDetailPage.ts` — especialización detalle (blog/talk)
- `tests/support/ui/content/ContentExperienceDetailPage.ts` — especialización experiencia
- `tests/support/ui/content/ContentTagsPage.ts` — especialización filtrado por tags
- `tests/support/ui/content/BlogPages.ts`, `WorkPages.ts`, `TalkPages.ts`, etc. — actualización de helpers

Cada método incluye JSDoc explicando su responsabilidad, parámetros y comportamiento esperado.

## Referencias

- [CONTENT_PAGE_OBJECTS_ARCHITECTURE.md](../CONTENT_PAGE_OBJECTS_ARCHITECTURE.md) — referencia
  arquitectónica de alto nivel
- [TESTING_STRATEGY.md](../TESTING_STRATEGY.md) — estrategia general de testing E2E
