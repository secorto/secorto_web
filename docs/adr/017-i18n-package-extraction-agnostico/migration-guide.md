# Anexo ADR 017: Migration Guide — Referencia de Extracción

**Propósito:** Inventario de primitivas agnósticas a extraer, criterios de validación y checklist
de refactoring. Este documento es descriptivo (QUÉ extraer), no prescriptivo (HOW implementar).

**Status:** Referencia para rama experimental. Implementación es flexible mientras se valide la
agnóstica.

---

## Primitivas Agnósticas a Extraer

### 1. `createLocales<L>()`

**Ubicación actual:** `@secorto/i18n/core` (ya existe en rama experimental)

**Responsabilidad:** Validar array de idiomas, proporcionar type guards.

**Contrato agnóstico:**

- Aceptar array de N idiomas (1, 2, 10...)
- Retornar interface con métodos de validación y conversión
- Nunca asumir idioma por defecto, locale específico, o count fijo

**Criterios de éxito:**

- ✅ Tests validan con N=1, N=2, N=5
- ✅ Type guard `isValid(lang): lang is L` funciona para cualquier L

---

### 2. `createRouteMap<L, C>()`

**Ubicación actual:** `@secorto/i18n/routing` (debe extraerse desde `apps/web/src/i18n/rootMap.ts`)

**Responsabilidad:** Compilar mapa de rutas indexado por locale. Validar duplicados. Agnóstico de M
  (tipo de mapa: collections, tags, singleton pages).

**Tipos base agnósticos (preliminares):**

```typescript
// Valor localizado para un idioma específico
type LocalizedValue<Language extends string, TValue> = Record<Language, TValue>

// Diccionario de valores localizados por sección/categoría
type SectionDictionary<Section extends string, Language extends string, TValue>
  = Record<Section, LocalizedValue<Language, TValue>>
```

**Contrato agnóstico:**

- Aceptar config: `SectionDictionary<C, L, string>` (ej: `{blog: {es: 'blog', en: 'blog'}, talk: {es: 'charla', en: 'talk'}}`)
- Retornar estructura agnóstica: `Record<C, Record<L, string>>` (indexado por sección primero, luego por language)
  - Acceso: `routes[section][language]` — natural del dominio
- Validar duplicados: si dos secciones mapean a mismo slug en mismo idioma, error en build-time
- Nunca asumir M (collections, tags, pages) fijo, estructura secorto, o prefijo `/locale/`
- Patrón especializable: mismo agnóstico funciona para 3 tipos → `collectionRoutesByLocale`, `tagRoutesByLocale`, `singletonPagesByLocale`

**Especialización: `SectionRoutes<Section, Language>`**

- Especializa `createRouteMap` agregando métodos: `getSectionRoute()`, `getSectionURL()`, `getEntryURL()`
- La interfaz es agnóstica: funciona con cualquier Section + Language, sin UI strings ni lógica secorto-specific
- Implementación retorna record `Record<Section, Record<Language, string>>` + métodos para construir URLs

**Criterios de éxito:**

- ✅ Tests validan con M=1, M=2, M=5 (tipos de mapa)
- ✅ Validación de duplicados lanza error descriptivo
- ✅ Estructura indexada por sección permite búsqueda O(1): `map[section][language] → slug`
- ✅ Mismo código funciona idénticamente para collections, tags, singleton pages
- ✅ `SectionRoutes` especializa sin agregar dependencias secorto-specific

---

### 3. `createTranslationIndex<L, E, C>()`

**Ubicación actual:** Debe extraerse desde `apps/web/src/i18n/`

**Responsabilidad:** Indexar entries por `translationKey` y locale. Detectar duplicados.

**Contrato agnóstico:**

- Aceptar array: `LocalizedEntry<E, C, L>[]`
- Retornar: `TranslationIndex<L, E, C>` = `Record<translationKey, Partial<Record<L, entry>>>`
- Validar duplicados: si mismo key + locale en dos entries, error
- Nunca asumir estructura de E (entry), C (section), tipo de contenido

**Criterios de éxito:**

- ✅ Tests validan con N=1, N=2, N=5 (idiomas)
- ✅ Tests validan con cualquier tipo E (BlogPost, Talk, etc.)
- ✅ Tests validan con cualquier section C ('blog', 'docs', etc.)
- ✅ Duplicates detectados en build-time

---

## Refactoring en `apps/web`

### Eliminar

- [ ] `src/domain/section.ts` — Eliminar monolito SectionConfig completamente
- [ ] Cualquier agregación de routing + UI + categorización en single type/interface

### Crear

- [ ] Instancia de `createLocales(['es', 'en'])`
- [ ] 3 instancias de `createRouteMap<L, C>()` con config secorto (2 idiomas, especializado):
  - [ ] `collectionRoutesByLocale` (blog, talk, docs, etc.) — estructura: `Record<Section, Record<Language, Slug>>`
  - [ ] `tagRoutesByLocale` (tags dinámicos, estructura: `Record<Section, Record<Language, Slug>>`)
  - [ ] `singletonPagesByLocale` (about, tags-page, etc., estructura: `Record<Section, Record<Language, Slug>>`)
- [ ] Instancia de `createTranslationIndex()` con todas las entries
- [ ] Mapas granulares: `uiMap` (translationKey, ctaKey, showFeaturedImage), `collectionCategoryMap` (si E2E lo necesita)

### Actualizar Call-Sites

- [ ] Pages: cambiar `sectionsConfig[section].routes[locale]` → `collectionRoutesByLocale[section][locale]`
- [ ] Components: cambiar `sectionsConfig[section].translationKey` → `uiMap[section].translationKey`
- [ ] Tests E2E: cambiar `sectionsConfig[section].category` → `collectionCategoryMap[section]`
- [ ] Helpers: refactorizar `createLocalizedEntryLinks()` para usar mapas indexados por locale
- [ ] Collection filters: usar helpers agnósticos (filterByLocale, mapEntryId) o mover a `astro/utils.ts`

---

## Criterios de Validación

### Agnóstica Verificable

- ✅ Ninguna primitiva asume idioma por defecto fijo (no es 'es')
- ✅ Ninguna primitiva asume count de sections/idiomas fijo
- ✅ Ninguna primitiva contiene UI strings, componentes, o lógica secorto-specific
- ✅ Tests no usan fixtures con datos realistas secorto (blog, talk, etc.)
- ✅ `createRouteMap` retorna estructura indexada por sección: `Record<C, Record<L, string>>` (búsqueda O(1), NO O(n))
- ✅ Iteración agnóstica clara: primero locales, luego consulta mapa especializado (NO itera todo el mapa)
- ✅ Mismo código funciona idénticamente para N=1/M=1, N=2/M=5, N=5/M=10

### Migración Exitosa

- ✅ `pnpm test:unit` pasa (sin `sectionsConfig`)
- ✅ `pnpm test:e2e` pasa (todos los flujos de usuario funcionan)
- ✅ `pnpm type-check` clean
- ✅ `pnpm lint` clean (ESLint, markdownlint)

---

## Checklist de Implementación

### Estructura de @secorto/i18n

- [ ] `@secorto/i18n/core` — Entrypoint para `createLocales<L>()`
- [ ] `@secorto/i18n/routing` — Entrypoint para `createRouteMap<L, C>()`
  - [ ] Tipos base agnósticos: `LocalizedValue<L, TValue>`, `SectionDictionary<C, L, TValue>`
  - [ ] Función: `createRouteMap<L, C>(config): Record<C, Record<L, string>>`
  - [ ] Validación de duplicados en build-time
  - [ ] Especialización: `SectionRoutes<Section, Language>` con métodos `getSectionRoute()`, `getEntryURL()`, etc.
- [ ] `@secorto/i18n/translation` — Entrypoint para `createTranslationIndex<L, E, C>()`
  - [ ] Tipos agnósticos base
  - [ ] Función principal
  - [ ] Validación de duplicados en build-time
- [ ] `@secorto/i18n/astro` — Helpers Astro agnósticos (opcional, si se decide exportar)

### Tests Agnósticos

- [ ] Tests para `createLocales` (N=1, N=2, N=5)
- [ ] Tests para `createRouteMap` (M=1, M=2, M=5; validar duplicados)
- [ ] Tests para `createTranslationIndex` (N=1, N=2, N=5; validar duplicados)
- [ ] Sin mocks extremos, solo fixtures mínimas que demuestren agnóstica
- [ ] Verificar que estructura indexada por locale permite búsqueda O(1)

### Refactor apps/web

- [ ] Delete `src/domain/section.ts` completamente
- [ ] Crear instancias de primitivas en `src/i18n/config.ts`:
  - [ ] `languages = createLocales(['es', 'en'])`
  - [ ] `collectionRoutesByLocale = createSectionRoutes({blog: {es: 'blog', en: 'blog'}, talk: {es: 'charla', en: 'talk'}, ...})`
    - Estructura retornada: `Record<Section, Record<Language, Slug>>` — sección primero, luego idioma
    - Acceso: `collectionRoutesByLocale[section][language]` → slug localizado
  - [ ] `tagRoutesByLocale = createRouteMap({...})` (dinámico, si se usa)
  - [ ] `singletonPagesByLocale = createRouteMap({...})` (about, tags-page)
- [ ] Crear mapas granulares: `src/i18n/uiMap.ts` (translationKey, ctaKey, showFeaturedImage)
- [ ] **Reorganizar helpers Astro por bounded context:**
  - [ ] `src/i18n/astro/index.ts` — `createLocalePathsForCollections()` (list pages)
  - [ ] `src/i18n/astro/details.ts` — `createDetailPathsForCollection()` (detail pages)
  - [ ] `src/i18n/astro/tags.ts` — `createLocalePathsForTags()` (tag pages)
  - [ ] `src/i18n/astro/pages.ts` — `createSingletonPaths()` (about, tags-page)
- [ ] Refactorizar `createLocalizedEntryLinks()` en `languagePickerUtils.ts` para usar mapas indexados
- [ ] Update all imports de `sectionsConfig` en páginas, componentes, tests
- [ ] Update E2E tests con nuevos nombres de mapas
- [ ] Validar `pnpm test:unit` pasa
- [ ] Validar `pnpm test:e2e` pasa
- [ ] Validar `pnpm type-check` clean
- [ ] Validar `pnpm lint` clean
