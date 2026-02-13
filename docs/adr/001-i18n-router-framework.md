# ADR 001: Framework i18n y router polimórfico de secciones

> **Estado:** Aceptada
> **Fecha:** 2025-06
> **Categoría:** Arquitectura / i18n / Routing

---

## Contexto

El sitio **secorto\_web** es un portafolio y blog personal multilingüe
(español e inglés) construido con Astro. A medida que creció el número de
secciones (blog, charlas, trabajo, proyectos, comunidad) se evidenciaron
varios problemas:

1. **Duplicación masiva (~95 %):** cada sección tenía su propio
   `[locale]/blog/index.astro`, `[locale]/charla/index.astro`, etc. con
   lógica casi idéntica y valores hardcodeados.
2. **Aliasing por idioma:** la misma sección se llamaba `charla` en español y
   `talk` en inglés; no había una fuente centralizada de esas rutas.
3. **Escala O(n):** agregar una nueva sección significaba crear ~4 archivos
   (índice + detalle + tags × 2 idiomas) copiando código existente.
4. **Fragilidad:** cambios en la estructura de una página de sección debían
   replicarse manualmente en las demás.

Astro ofrece i18n con `prefixDefaultLocale`, pero **no provee un router de
secciones polimórfico** ni aliasing de rutas por idioma. Esa pieza debía
construirse.

---

## Decisión

Construir un **framework de routing polimórfico** sobre Astro usando tres
pilares:

### 1. Configuración centralizada — `src/config/sections.ts`

Un registro tipado (`Record<SectionType, SectionConfig>`) que define para
cada sección:

```typescript
interface SectionConfig {
  collection: CollectionKey       // colección Astro
  translationKey: TranslationKey  // clave i18n del título
  hasTags: boolean                // si soporta tags
  taggedKey?: TranslationKey      // clave i18n para "tagged with"
  routes: Record<UILanguages, string>  // alias por idioma
  listComponent: 'ListPost' | 'ListWork'
  detailComponent: 'BlogTalkPostView' | 'WorkProjectCommunityView'
  showFeaturedImage: boolean
}
```

Ejemplo:

```typescript
talk: {
  collection: 'talk',
  translationKey: 'nav.talks',
  hasTags: true,
  routes: { es: 'charla', en: 'talk' },  // ← aliasing
  listComponent: 'ListPost',
  detailComponent: 'BlogTalkPostView',
  showFeaturedImage: true
}
```

### 2. Router universal — páginas dinámicas de Astro

Tres archivos `.astro` reemplazan a los ~8 originales:

```
src/pages/[locale]/[section]/
├── index.astro       ← índice de sección (5 secciones × 2 idiomas = 10 rutas)
├── [...id].astro     ← detalle de entrada (todas las entradas × 2 idiomas)
└── tags/[tag].astro  ← página de tag (secciones con hasTags × tags × 2 idiomas)
```

Cada uno usa `getStaticPaths()` alimentado por `staticPathsBuilder.ts` que
itera la configuración centralizada para generar todas las rutas en build time.

### 3. Capa de datos — funciones de carga

| Archivo | Responsabilidad |
|---|---|
| `sectionLoader.ts` | Cargar datos de sección por ruta URL |
| `sectionContext.ts` | Construir contexto de página (índice, tags, detalle) |
| `staticPathsBuilder.ts` | Generar paths estáticos para `getStaticPaths` |
| `paths.ts` | Utilidades de filtrado/ordenación por locale y colección |
| `ids.ts` | Extraer clean IDs de las entradas |

---

## Arquitectura resultante

```
Solicitud: /es/charla
         │
         ▼
[locale]/[section]/index.astro    ← Router universal
         │
         ├─ getSectionConfigByRoute('charla', 'es')
         │  └─→ sectionsConfig.talk
         │
         ├─ loadSectionByRoute('charla', 'es')
         │  ├─ getPostsByLocale('talk', 'es')
         │  └─ getUniqueTags(posts)
         │
         └─ SectionRenderer.astro
            └─ config.listComponent === 'ListPost'
               └─→ <ListPost posts={posts} />
```

### Generación de rutas estáticas

```
buildSectionIndexPaths()
  → iterateSectionLocales()
    → 5 secciones × 2 idiomas = 10 rutas

buildTagPaths()
  → iterateSectionLocales(c => c.hasTags)
    → 2 secciones × 2 idiomas × N tags = rutas de tags

buildAllDetailPaths()
  → iterateSections()
    → buildDetailPathsForSection(entries, config)
      → entries por locale × secciones = rutas de detalle
```

---

## Alternativas consideradas

### A. Mantener rutas manuales por sección

- ✅ Simple de entender para un desarrollador nuevo
- ❌ 95 % de duplicación
- ❌ Escala O(n) con cada nueva sección
- ❌ Fragilidad ante cambios transversales

### B. Usar un framework i18n de terceros (e.g. astro-i18next)

- ✅ Comunidad y soporte
- ❌ No resuelve el aliasing de rutas por sección (`charla` ↔ `talk`)
- ❌ Agrega una dependencia con su propio modelo mental
- ❌ No maneja el polimorfismo de componentes por tipo de sección

### C. Configuración centralizada + router dinámico (elegida)

- ✅ Cero duplicación
- ✅ Escala O(1): agregar sección = agregar ~6 líneas en `sections.ts`
- ✅ Type-safe: TypeScript valida todas las claves y configuraciones
- ✅ Aliasing nativo por idioma
- ✅ Dos componentes de detalle cubren 5 colecciones distintas
- ⚠️ Requiere entender la indirección de configuración

---

## Métricas de impacto

| Métrica | Antes | Después | Mejora |
|---|---|---|---|
| Duplicación | 95 % | 0 % | Eliminada |
| Archivos de routing | 8 | 3 | −63 % |
| Puntos de cambio | 5+ | 1 | −80 % |
| Complejidad | O(n) | O(1) | Constante |
| Tiempo para agregar sección | ~40 min | ~4 min | −90 % |

---

## Componentes del sistema

### Configuración

- [src/config/sections.ts](../../src/config/sections.ts) — Registro centralizado de secciones
- [src/i18n/ui.ts](../../src/i18n/ui.ts) — Claves de traducción y definición de idiomas

### Router

- [src/pages/\[locale\]/\[section\]/index.astro](../../src/pages/%5Blocale%5D/%5Bsection%5D/index.astro) — Índice de sección
- [src/pages/\[locale\]/\[section\]/\[...id\].astro](../../src/pages/%5Blocale%5D/%5Bsection%5D/%5B...id%5D.astro) — Detalle de entrada
- [src/pages/\[locale\]/\[section\]/tags/\[tag\].astro](../../src/pages/%5Blocale%5D/%5Bsection%5D/tags/%5Btag%5D.astro) — Página de tag

### Capa de datos

- [src/utils/staticPathsBuilder.ts](../../src/utils/staticPathsBuilder.ts) — Generador de paths estáticos
- [src/utils/sectionLoader.ts](../../src/utils/sectionLoader.ts) — Cargador por ruta URL
- [src/utils/sectionContext.ts](../../src/utils/sectionContext.ts) — Constructor de contexto de página
- [src/utils/paths.ts](../../src/utils/paths.ts) — Filtrado por locale y colección

### Vistas

- `BlogTalkPostView` — Vista de detalle para blog y charlas
- `WorkProjectCommunityView` — Vista de detalle para trabajo, proyectos y comunidad
- `SectionRenderer.astro` — Renderizado polimórfico de listados

---

## Consecuencias

### Positivas

- **Single Source of Truth:** toda la configuración de secciones vive en un
  solo archivo type-safe.
- **Aliasing multiidioma nativo:** `charla` (es) ↔ `talk` (en) resuelto por
  configuración, sin redirecciones ni hacks.
- **Extensibilidad:** agregar una sección nueva es agregar un bloque en
  `sectionsConfig` y, opcionalmente, un nuevo `listComponent`.
- **Testabilidad:** `staticPathsBuilder` usa inyección de dependencias para
  `getCollection` y `getPostsByLocale`, logrando 100 % de cobertura unitaria.

### A tener en cuenta

- La indirección (ruta URL → config → colección → datos) puede ser confusa
  para alguien que ve el código por primera vez. La documentación en
  `docs/refactor-sections/` mitiga esto.
- Si Astro introduce un sistema nativo de aliasing de rutas i18n en el
  futuro, evaluar si simplifica o reemplaza este framework.

---

## Documentación extendida

La carpeta `docs/refactor-sections/` contiene documentación detallada de la
implementación original:

- [ARCHITECTURE_SECTIONS.md](../refactor-sections/ARCHITECTURE_SECTIONS.md) — Arquitectura técnica detallada
- [ARCHITECTURE_DIAGRAM.md](../refactor-sections/ARCHITECTURE_DIAGRAM.md) — Diagramas de flujo
- [BEFORE_AFTER_COMPARISON.md](../refactor-sections/BEFORE_AFTER_COMPARISON.md) — Comparación antes/después
- [SCALABILITY_ANALYSIS.md](../refactor-sections/SCALABILITY_ANALYSIS.md) — Análisis de escalabilidad
- [MIGRATION_GUIDE.md](../refactor-sections/MIGRATION_GUIDE.md) — Guía de migración
- [DETAIL_VIEW_ARCHITECTURE.md](../DETAIL_VIEW_ARCHITECTURE.md) — Arquitectura de vistas de detalle

---

## Referencias

- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro i18n Routing](https://docs.astro.build/en/guides/internationalization/)
- [Configuration-Driven Design](https://martinfowler.com/articles/bduf-lenses.html)
