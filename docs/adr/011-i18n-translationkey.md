---
title: ADR 011 - `translationKey` como llave canónica de traducción
status: accepted
date: 2026-05-18
last_updated: 2026-07-20
categories:
  - Architecture
  - i18n
  - Domain
---

## Contexto

La centralización de dominio (ADR 007) propuso usar `postId` como llave canónica,
pero durante la implementación se identificaron problemas conceptuales graves:

1. **Ambigüedad semántica sin resolver**: `postId` mezcla **identidad de recurso**
   (ruta, ID interno) con **llave de traducción**. Esta confusión complica futuras
   refactorizaciones y hace el código frágil.
2. **Sin invariante explícito en tests**: Fixtures de test usaban `postId` pero sin
   claridad sobre qué representaba exactamente; tests no tenían forma canónica de
   vincular entradas entre locales.
3. **Riesgo de duplicidad silenciosa**: Sin una llave clara y agnóstica, entradas
   duplicadas por `(postId, locale)` pueden pasar validación de build.

### Impacto del problema

La ambigüedad de 007 requirió un **refactor considerable**: cambiar todos los posts
(frontmatter) y fixtures de test para usar `translationKey` explícito, dejando claro
qué identificador representa la "fila lógica" de traducción.

## Decisión

Adoptar `translationKey` como **la única llave canónica** para identificar mensajes de UI
y contenido. No usar identificadores de recurso (`postId`) como llave de traducción.

`translationKey` debe ser:

- Independiente de rutas, IDs internos o cambios de estructura
- Obligatorio (no nullable, no opcional) en objetos de contenido donde aplique
- Estable ante refactorizaciones de dominio o cambios en routing

## Razonamiento

- **Separación semántica**: Desacopla identidad de recurso (ruta, ID interno) de
  identidad de mensaje. Esto permite reutilizar textos entre tipos de contenido y
  previene acoplamientos cuando cambian rutas o IDs.
- **Estabilidad ante cambios**: `translationKey` es agnóstico a refactorizaciones
  de dominio. Cambiar rutas, estructura de colecciones o IDs internos no invalida
  las traducciones.
- **Claridad en el dominio**: Expresar explícitamente qué identificador representa
  la fila lógica de traducción reduce ambigüedad y facilita auditoría de contenido.

## Alternativas consideradas

1. **Mantener `postId` como llave de traducción (implementación de ADR 007)**
   - Rechazada: `postId` es identidad de recurso; confunde responsabilidades.
   - Problema: cambios en rutas/IDs internos invalidan fixtures y requieren auditar
     todos los posts para asegurar consistencia.
   - Impacto: refactor considerable de todos los posts ya sin claridad conceptual.

2. **Usar rutas/slugs como llave**
   - Rechazada: acopla dominio a decisiones de routing; imposible refactorizar sin
     afectar traducción.

3. **No tener llave canónica, solo referencias cruzadas**
   - Rechazada: hace testing frágil y permite duplicidad silenciosa.

## Consecuencias

### Positivas

- Modelo de dominio más explícito y agnóstico a cambios de implementación
- Tests más robustos y legibles (fixtures usan identificadores semánticos claros)
- Prevención de errores silenciosos (duplicidad, inconsistencias entre locales)

### Costos

- Adopción inicial en fixtures y contenido (trabajo una sola vez)
- CI puede requerir validación adicional (e.g. consistencia de `translationKey`
  entre locales)

## Referencias

- [ADR 007: Unificación de dominio e i18n](./007-domain-i18n-unificacion.md) —
  ADR padre: 011 surge como refinamiento de 007, sustituyendo específicamente la
  recomendación de usar `postId` como llave de traducción por `translationKey`.
  El resto de decisiones de 007 (normalización de objetos, `localeLinks`, APIs SEO)
  permanecen vigentes.
- [ADR 002: Migración de Cypress a Playwright + Vitest](./002-testing-framework-migration.md) —
  contexto de frameworks de testing
- [docs/architecture/TESTING_STRATEGY.md](../architecture/TESTING_STRATEGY.md) —
  estrategia general de testing
