# Anexo ADR 017: Inventario de Funciones — Core Agnóstico vs Secorto-Específico

**Propósito:** Mapear cada función/tipo en el codebase actual y clasificar si pertenece al core
agnóstico de `@secorto/i18n` o si es específico de `apps/web` (secorto).

---

## Matriz: Función → Clasificación → Destino

### Capa: `@secorto/i18n` (Actual — rama experimental)

| Función | Ubicación | ¿Agnóstica? | Asume N idiomas | Asume M sections | Destino |
| --- | --- | --- | --- | --- | --- |
| createLocales | locale.ts | ✅ Sí | ✅ Genérico | N/A | Core: src/core |

**Estado:** Core minimal, solo primitiva agnóstica. Todo lo demás vive en apps/web hoy.

**Nota sobre master:** En master no existe `packages/i18n/` como paquete. El sitio es monolítico en `apps/web/`.

---

### Capa: `apps/web/src/i18n/` (Candidatos a extraer como primitivas)

| Código | Ubicación | Clasificación | Destino |
| --- | --- | --- | --- |
| `languages` config | `ui.ts` | Primitiva 1: `createLocales<L>()` | `@secorto/i18n/core` |
| `rootMap` (routes por collection/locale — static pages) | `rootMap.ts` | Primitiva 2: `createRouteMap<L, C>()` (agnóstico: collections, tags, singleton pages) | `@secorto/i18n/routing` |
| `createLocalizedEntryLinks()` | `languagePickerUtils.ts` | ✅ Helper agnóstico: itera locales sobre `collectionRoutesByLocale` | Package agnóstico (apps/web) |
| `findSectionMap()` | `languagePickerUtils.ts` | ✅ Helper agnóstico | `packages/i18n/` o `apps/web/src/` |
| `ui` strings, `languagesMap` (UI labels) | `ui.ts` | ❌ Secorto-específico | `apps/web/src/i18n/ui.ts` |
| `tagsMap` (mapa de tags — MISMO patrón `Record<L, C>` que collections/pages) | `paths.ts` | ✅ Usa `createRouteMap<L, C>()` | Config secorto en `apps/web/src/i18n/config.ts` |
| `languagesConfig` (instancia secorto) | `ui.ts` | Instancia secorto | `apps/web/src/i18n/config.ts` |

---

### Capa: `apps/web/src/i18n/astro/` (Helpers Astro agnósticos, organizados por bounded context)

| Función | Ubicación → Nueva | Bounded Context | Destino |
| --- | --- | --- | --- |
| `createLocalePathsForCollections()` | `staticPathsBuilder.ts` → `i18n/astro/index.ts` | Collections (list pages) | Helper de Astro |
| `createDetailPathsForCollection()` | `staticPathsBuilder.ts` → `i18n/astro/details.ts` | Details (detail pages) | Helper de Astro |
| `createLocalePathsForTags()` | `staticPathsBuilder.ts` → `i18n/astro/tags.ts` | Tags (tag pages) | Helper de Astro |
| `filterByLocale()` | `paths.ts` → Considerar mover | Utilities | Helper agnóstico |
| `mapEntryId()` | `paths.ts` → Considerar mover | Utilities | Helper agnóstico |
| `getUniqueTags()` | `paths.ts` → Considerar mover | Utilities | Helper agnóstico |

---

### Capa: `apps/web/src/domain/` (ELIMINAR SectionConfig)

| Función/Tipo | Ubicación | ¿Agnóstica? | Asume N idiomas | Asume M sections | Destino |
| --- | --- | --- | --- | --- | --- |
| `SectionConfig` | `section.ts` | ❌ No | N/A | ❌ Hardcoded | 🗑️ DELETE |
| `SectionType` | `section.ts` | ❌ No | N/A | ❌ Literal | 🗑️ DELETE |
| `EntryCategory` | `section.ts` | ❌ No | N/A | ❌ Enum | 🗑️ DELETE |
| `sectionsConfig` | `section.ts` | ❌ No | N/A | ❌ Hardcoded 5 | 🗑️ DELETE |

---

### Capa: `apps/web/src/components/` (Astro-specific, NO al paquete)

| Función/Mapa | Ubicación | ¿Agnóstica? | Destino |
| --- | --- | --- | --- |
| `detailComponentMap` | `detail/DetailContent.astro` | ❌ No | App: apps/web |
| `listingComponentMap` | `list/ListContent.astro` | ❌ No | App: apps/web |

---

## Primitivas Agnósticas Centrales → `@secorto/i18n`

### Tres primitivas independientes y ortogonales

1. ✅ **`createLocales<L>()`**
   - Ubicación actual: `@secorto/i18n/core` (rama experimental)
   - Responsabilidad: Type guard + validación de array de idiomas
   - Agnóstica: ✅ Sí (funciona con cualquier N)

2. ✅ **`createRouteMap<L, C>()`** ← Patrón agnóstico (replicable para collections, tags, singleton pages)**
   - Ubicación actual: `rootMap` (monolítico: collections + tags + singleton pages)
   - **Antipatrón detectado:** Iterar TODO el mapa para buscar un slug por idioma (O(n), confuso)
   - Estructura agnóstica: `Record<C, Record<L, string>>` (indexado por sección primero, luego por idioma)
   - Acceso: `routes[section][language]` — natural del dominio, búsqueda O(1)
   - Responsabilidad: Compilar + validar mapa de rutas (indexado por sección, sin duplicados)
   - Agnóstica: ✅ Sí (funciona con cualquier M, cualquier estructura)
   - **Especialización requerida:** Separar en 3 mapas especializados por bounded context:
     - `collectionRoutesByLocale` — mapear sección+idioma → slug canonical (blog, talk, etc.; es/en)
     - `tagRoutesByLocale` — mapear sección+idioma → slug canonical (tags: es/en, dinámico)
     - `singletonPagesByLocale` — mapear sección+idioma → slug canonical (about, tags-page, etc.; es/en, fijo)
   - **Beneficio:** Búsqueda O(1), acceso natural por secciones del dominio

3. ✅ **`createTranslationIndex<L, E, C>()`**
   - Ubicación actual: No existe aún (derivado de patterns en apps/web/src/utils/)
   - Responsabilidad: Indexar entries por translationKey + locale, validar duplicados
   - Agnóstica: ✅ Sí (funciona con cualquier E, C, L)

---

## Código Secorto-Específico → `apps/web/`

### Dejar/Crear en apps/web/src/i18n/

- ✅ `config.ts` — Instancia de primitivas + mapas agnósticos especializados
  (collectionRoutesByLocale, tagRoutesByLocale, singletonPagesByLocale) con N=2, M variables
- ✅ `uiMap.ts` — Mapeo secorto-específico (translationKey, ctaKey, showFeaturedImage por collection)
- ✅ `routesMap.ts` — Config routing collections (indexado por locale)
- ✅ **`astro/index.ts`** — Paths para list pages (createLocalePathsForSection)
- ✅ **`astro/details.ts`** — Paths para detail pages (createDetailPathsForCollection)
- ✅ **`astro/tags.ts`** — Paths para tag pages (createTagPathsForSection)
- ✅ `ui.ts` — UI strings secorto

### ELIMINAR de apps/web/src/domain/

- 🗑️ `section.ts` — Monolito `SectionConfig` + tipos (`SectionType`, `EntryCategory`)
- 🗑️ `sectionsConfig` — Reemplazar con instancias de `createRouteMap()` especializadas

### Helpers Astro (Agnósticos, organizados por bounded context)

- **`src/i18n/astro/index.ts`** — Paths para list pages: itera locales sobre `collectionRoutesByLocale` + `tagRoutesByLocale`
- **`src/i18n/astro/details.ts`** — Paths para detail pages: itera locales sobre `collectionRoutesByLocale`
- **`src/i18n/astro/tags.ts`** — Paths para tag pages: itera locales sobre `tagRoutesByLocale`
- **`src/i18n/astro/pages.ts`** — Paths para singleton pages: itera locales sobre `singletonPagesByLocale`
- `filterByLocale()`, `mapEntryId()`, `getUniqueTags()` — Agnósticas, considerar mover a `astro/` o dejar en utils
- `detailComponentMap`, `listingComponentMap` — Secorto-específicas, dejar en apps/web
- **Estructura agnóstica clara:** Cada helper itera locales + consulta map especializado, NO itera todo el mapa

---

## Refactorings Necesarios

### Cambios en `apps/web`

**Primitiva 1: Instancia `createLocales`**

- Ubicación actual: `ui.ts` config
- Cambio: Crear `src/i18n/config.ts` con `languages = createLocales(['es', 'en'])`
- Impacto: Update imports en todos los call-sites

**Primitiva 2: Instancia `createRouteMap` (patrón reutilizable — collections, tags, singleton pages)**

- Ubicación actual: `rootMap.ts` (monolítico, antipatrón O(n))
- Patrón agnóstico: Invertir índice → `Record<L, Record<Slug, Canonical>>`
- Cambio: Crear 3 mapas especializados indexados por locale:
  - `collectionRoutesByLocale = { es: {blog: 'blog', charlas: 'talk'}, en: {blog: 'blog', talks: 'talk'} }`
  - `tagRoutesByLocale = { es: {tag1: 'tag1'}, en: {tag1: 'tag1'} }`
  - `singletonPagesByLocale = { es: {acerca-de: 'about', tags: 'tags'}, en: {about: 'about', tags: 'tags'} }`
- Beneficio: Búsqueda O(1), iteración clara sobre locales, especialización por tipo
- Impacto: Refactorizar `findSectionMap()` y `createLocalizedEntryLinks()` (usar lookup directo en mapas especializados)

**Primitiva 3: Instancia `createTranslationIndex`**

- Ubicación actual: No existe (requiere nueva estructura para indexar entries)
- Cambio: Crear en `src/i18n/` u otro lugar agnóstico
- Impacto: Improve lookup de "qué versiones de esta entry existen en otros idiomas"

### Organizar helpers Astro por bounded context

- Nuevo folder: `src/i18n/astro/`
- Separar `staticPathsBuilder.ts` monolítico en:
  - `index.ts` — createLocalePathsForCollections (list pages)
  - `details.ts` — createDetailPathsForCollection (detail pages)
  - `tags.ts` — createLocalePathsForTags (tag pages)
- Beneficio: Claridad, cada archivo tiene responsabilidad única

**Eliminar `SectionConfig` monolito**

- Delete: `src/domain/section.ts`
- Reemplazar: Con mapas granulares especializados (agnósticos, indexados por locale):
  - `collectionRoutesByLocale` para collections (indexado por locale)
  - `tagRoutesByLocale` para tags (dinámico, indexado por locale)
  - `singletonPagesByLocale` para singleton pages (about, tags-page, indexado por locale)
  - `uiMap` para translationKey, ctaKey, showFeaturedImage (por collection)
  - `collectionCategoryMap` (opcional, solo si E2E lo necesita)

---

## Matriz de Cambios

| Acción | Qué | Ubicación Actual | Ubicación Nueva | Impacto |
| --- | --- | --- | --- | --- |
| Extract | Primitiva 1: `createLocales` | `@secorto/i18n/core` (experimental) | ✅ Mismo lugar | Zero impact |
| Extract | Primitiva 2: `createRouteMap<L, C>()` agnóstico | `rootMap.ts` (monolítico) | `@secorto/i18n/routing` | Refactorizar a 3 mapas especializados indexados por locale (collectionRoutesByLocale, tagRoutesByLocale, singletonPagesByLocale) |
| Extract | Primitiva 3: `createTranslationIndex` | No existe (nuevo) | `@secorto/i18n/translation` | Nuevo, cero impact inicial |
| Delete | `SectionConfig` monolito | `src/domain/section.ts` | 🗑️ | Reemplazar con mapas granulares |
| Create | Helpers Astro: `createLocalePathsForCollections` | `staticPathsBuilder.ts` | `src/i18n/astro/index.ts` | Bounded context: list pages |
| Create | Helpers Astro: `createDetailPathsForCollection` | `staticPathsBuilder.ts` | `src/i18n/astro/details.ts` | Bounded context: detail pages |
| Create | Helpers Astro: `createLocalePathsForTags` | `staticPathsBuilder.ts` | `src/i18n/astro/tags.ts` | Bounded context: tag pages |
| Refactor | `findSectionMap()` busca O(n) → DELETE | `rootMap.ts` | Eliminar (usar lookup O(1) directo) | Cambiar call-sites a mapas indexados |

---

## Criterios de Validación Agnóstica

**Cada primitiva debe validarse con múltiples fixtures agnósticas:**

### `createLocales<L>()`

| Escenario | Fixture | Valida |
| --- | --- | --- |
| 1 idioma | `['en']` | Agnóstico de N=1 |
| 2 idiomas | `['es', 'en']` | Agnóstico de N=2 (secorto) |
| 5 idiomas | `['es', 'en', 'fr', 'de', 'ja']` | Agnóstico de N=5 |

### `createRouteMap<L, C>()` (patrón agnóstico — indexado por locale, especializado por tipo de página)

**Estructura agnóstica:** `Record<L, Record<Slug, Canonical>>`

Transformación clara: Itera LOCALES, no todo el mapa.

```typescript
// Input: collectionConfig = { blog: {es: 'blog', en: 'blog'}, talk: {es: 'charlas', en: 'talks'} }
// Output (indexado por locale):
collectionRoutesByLocale = {
  es: { 'blog': 'blog', 'charlas': 'talk' },
  en: { 'blog': 'blog', 'talks': 'talk' }
}
// Lookup O(1): collectionRoutesByLocale['es']['charlas'] → 'talk'

// Singleton pages: páginas únicas por locale
singletonPagesByLocale = {
  es: { 'acerca-de': 'about', 'tags': 'tags' },
  en: { 'about': 'about', 'tags': 'tags' }
}
```

| Escenario | Fixture | Valida |
| --- | --- | --- |
| 1 idioma, 1 collection | `{en: {blog: 'blog'}}` → `{en: {blog: 'blog'}}` | Agnóstico de N=1, M=1 |
| 2 idiomas, 5 collections | (secorto) → `{es: {blog, charlas, ...}, en: {blog, talks, ...}}` | Agnóstico de N=2, M=5 |
| 5 idiomas, 1 collection | Input de 5 locales → output con 5 locales indexados | Agnóstico de N=5, M=1 |
| **Tags (mismo patrón):** 2 idiomas, N tags | (dinámico) → `{es: {tag1, tag2...}, en: {...}}` | Agnóstico de N=2, M tags (lookup O(1)) |
| **Singleton pages (patrón igual):** 2 idiomas, 2 páginas | (about, tags-page) → `{es: {acerca-de: about, tags}, en: {...}}` | Agnóstico de N=2, M=2 (páginas únicas) |
| **Duplicates:** Mismo slug en un locale | Debe lanzar error durante construcción | Validación agnóstica (igual en todos) |
| **Iteración clara:** Para cada locale, define qué slug mapea a qué canonical | No itera TODO el mapa | Pattern agnóstico |

### `createTranslationIndex<L, E, C>()`

| Escenario | Fixture | Valida |
| --- | --- | --- |
| 1 idioma, 1 entry | `[{ translationKey: 'post-1', locale: 'en', ...}]` | Agnóstico de N=1, E=any, C=any |
| 2 idiomas, 5 entries | (con versiones multi-idioma) | Agnóstico de N=2, M entries |
| **Duplicates**: same key + locale | Debe lanzar error | Validación agnóstica |

**Regla:** Ningún test debe asumir N o M fijo, ningún test debe contener UI strings o lógica secorto.

---

## Referencias

- `apps/web/src/i18n/languagePickerUtils.ts` — refactorizar `createLocalizedEntryLinks()` para usar mapas indexados
- `apps/web/src/i18n/rootMap.ts` — refactorizar a mapas especializados por locale (antipatrón O(n) → O(1))
- `apps/web/src/i18n/ui.ts`
- `apps/web/src/utils/staticPathsBuilder.ts` — usar nuevos mapas indexados
- `apps/web/src/utils/paths.ts`
- `apps/web/src/domain/section.ts` ← **A eliminar**
- `@secorto/i18n` ← **Nuevas primitivas agnósticas**

---

## Estado del Arte

### En master (HEAD)

- ✅ Sitio monolítico en `apps/web/`
- ✅ Código i18n disperso en `src/i18n/`, `src/utils/`, `src/domain/`
- ❌ No existe paquete `packages/i18n/` como tal (solo primitiva `createLocales` en exploración)

### En rama experimental (actual)

- ✅ `packages/i18n/` con `createLocales<L>()` agnóstico
- ✅ Plan de extracción documentado (este ADR + anexos)
- ⏳ Implementación pendiente (cuando se decida en roadmap)
