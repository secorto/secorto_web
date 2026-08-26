---
title: ADR 017 — Eliminar SectionConfig monolítico en favor de mapas agnósticos para extracción de paquete i18n
status: proposed
date: 2026-08-26
last_updated: null
categories:
  - Architecture
  - i18n
  - Package Design
supersedes: []
superseded_by: null
related:
  - adr/001-i18n-router-framework.md
  - adr/007-domain-i18n-unificacion.md
  - adr/011-i18n-translationkey.md
  - adr/016-monorepo-workspace-pnpm.md
tags:
  - i18n
  - monorepo
  - package-design
  - architecture
  - separation-of-concerns

---

## Estado del Arte

**Rama Actual (Experimental):** Esta decisión propuesta se toma en rama experimental donde se
está explorando la creación del paquete `@secorto/i18n` como agnóstico.

**En master:**

- ✅ Sitio monolítico en `apps/web/`
- ✅ Código i18n disperso en `src/i18n/`, `src/utils/`, `src/domain/`
- ❌ No existe `packages/i18n/` como paquete formal (solo exploración de primitiva
  `createLocales`)
- ✅ `SectionConfig` existe en `apps/web/src/domain/section.ts` con estructura monolítica

**Impacto de esta ADR al fusionar a master:**

- Impacto **significativo** pero **interno**
- No breaking changes a usuarios externos (proyecto es de uso interno hoy)
- Refactoring puro: eliminar SectionConfig, desagregarlo en mapas granulares
- CI/CD: E2E completo debe pasar sin cambios observables a usuarios

## Contexto

El proyecto contiene un paquete `@secorto/i18n` en desarrollo con primitiva agnóstica (`createLocales<L>`),
pero el código que lo rodea en `apps/web/src/domain/section.ts` mezcla responsabilidades que impiden extraer
un paquete verdaderamente reusable:

- `SectionConfig` es un monolito que contiene múltiples concerns:
  - Rutas por idioma — agnóstico, reutilizable
  - Metadata de UI (translationKey, ctaKey, showFeaturedImage) — específico de secorto
  - Lógica de categorización (category: post | experience) — específico, usado solo en tests E2E
  - Configuración de presentación — específico de secorto

- Esta estructura asume número fijo de sections (5) y configuración rígida que no escala.

- Otros sitios reutilizando `@secorto/i18n` necesitarían N idiomas, M collections, y su propia lógica especializada.

- Extraer hoy el paquete significa llevar acoplamiento innecesario a otros proyectos.

## Decisión

Eliminar el monolito `SectionConfig` y adoptar un patrón de **mapas granulares desagregados por responsabilidad**:

1. **Separación clara de concerns:**
   - Responsabilidades agnósticas (rutas, lenguajes) → primitivas parametrizadas en `@secorto/i18n`
   - Configuración específica de cada proyecto → mapas locales en `apps/web/`

2. **Mapas granulares en lugar de monolito:**
   - Cada responsabilidad (routing, UI metadata, categorización) vive en su propio mapa/archivo
   - Cada mapa es independiente, no presupone estructura rígida

3. **Instanciación por proyecto:**
   - Cada sitio que reutilice `@secorto/i18n` instancia sus propios mapas (N idiomas, M collections)
   - No hay "valores por defecto" secorto que contaminen otros proyectos

4. **Eliminar `SectionConfig`:**
   - Archivo `src/domain/section.ts` desaparece completamente
   - Responsabilidades se distribuyen:
     - Rutas → instancia agnóstica (parámetro genérico)
     - UI metadata → mapa local `uiMap`
     - Categorización → mapa local `sectionCategoryMap` (si es necesario)
     - Componentes → dispatch local (Astro-specific)

## Razonamiento

- **Separación clara:** Core agnóstico (primitivas parametrizadas) vs configuración de proyecto (mapas granulares)
- **Escalabilidad:** N idiomas y M collections variables, sin asumir estructura rígida
- **Reusabilidad genuina:** `@secorto/i18n` no contiene lógica secorto (categorización, UI strings, etc.)
- **Simplicidad del core:** Algunos helpers (como prefijo de idioma) son específicos de configuración de sitio;
  se justifica este trade-off por claridad
- **Responsabilidad:** Cada proyecto consumidor decide qué helpers necesita, define sus mapas especializados
- **Testabilidad:** Primitivas agnósticas se validan con fixtures multi-idioma/multi-collection

## Trade-offs

- **Flexibilidad vs Simplicidad:** Algunos helpers que podrían ser agnósticos se configuran como project-specific
  para simplificar core inicial
- **Responsabilidad del consumidor:** Apps deben definir mapas especializados, no simplemente importar de paquete
- **Migración:** Refactor necesario en `apps/web` (eliminar SectionConfig, crear mapas granulares)

## Consecuencias

### Positivas

- Paquete agnóstico es genuinamente reusable (sin llevar lógica de secorto)
- Claridad conceptual: una responsabilidad por mapa
- Patrón extensible: agregar builder agnóstico es mover código a `packages/i18n/src/routing/`, no tocar app

### A tener en cuenta

- Migración de `apps/web` es trabajo de refactoring (pero sin breaking changes a usuarios, todo interno)
- Documentación debe ser clara sobre qué va en paquete vs qué va en proyecto consumidor
- Tests E2E de secorto seguirán usando metadata local (category map)

## Implementación

Detallado en anexos:

- [inventory.md](017-i18n-package-extraction-agnostico/inventory.md) — Análisis de funciones agnósticas vs secorto-specific
- [migration-guide.md](017-i18n-package-extraction-agnostico/migration-guide.md) — Pasos de refactoring y extracción

**Nota:** Anexos son documentos dinámicos que se pueden actualizar sin afectar esta decisión registrada.

## Referencias

- ADR 001: Framework i18n y router polimórfico
- ADR 007: Unificación dominio e i18n
- ADR 011: `translationKey` como llave canónica
- ADR 016: Adopt pnpm workspace monorepo
- docs/adr/010-plantilla-estandar-adr.md — Plantilla y directrices de contenido
- @secorto/step.createTestingStep — Patrón factory orquestador a replicar
