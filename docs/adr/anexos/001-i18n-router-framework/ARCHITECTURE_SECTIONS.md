# Arquitectura de Secciones - Sistema Polimórfico

Arquitectura de la solución para internacionalización basado en secciones

## Problema Resuelto

**Antes**: Duplicación significativa en archivos como:

- `src/pages/[locale]/blog/index.astro`
- `src/pages/[locale]/charla/index.astro`
- `src/pages/[locale]/trabajo/index.astro`

Cada uno tenía lógica similar pero con valores hardcodeados específicos a la sección.

**Después**: Única fuente de verdad con arquitectura polimórfica.

## Componentes Principales

### 1. **`src/config/sections.ts`** - Configuración Centralizada

Define el contrato de cada sección (colección, rutas, traducciones, componentes).

```typescript
export const sectionsConfig: Record<SectionType, SectionConfig> = {
  blog: {
    collection: 'blog',
    translationKey: 'nav.blog',
    hasTags: true,
    routes: { es: 'blog', en: 'blog' },
    listComponent: 'ListPost',
    showFeaturedImage: true
  },
  talk: {
    collection: 'talk',
    translationKey: 'nav.talks',
    hasTags: true,
    routes: { es: 'charla', en: 'talk' },  // ← Alias por idioma
    listComponent: 'ListPost',
    showFeaturedImage: true
  },
  // ... más secciones
}
```

**Ventajas**:

- Aliasing multiidioma: `charla` (es) → `talk` (en)
- Cambios en un solo lugar
- Type-safe: TypeScript valida todas las claves

### 2. **`src/utils/sectionLoader.ts`** - Cargador de Datos

Centraliza la lógica de carga de posts y tags.

```typescript
export async function loadSectionByRoute(
  sectionSlug: string,
  locale: UILanguages
) {
  const config = getSectionConfigByRoute(sectionSlug, locale)
  const posts = await getPostsByLocale(config.collection, locale)
  const tags = config.hasTags ? getUniqueTags(posts) : []

  return { config, posts, tags }
}
```

Sin `if` eternos ni duplicación.

### 3. **`src/components/SectionRenderer.astro`** - Renderizado Polimórfico

Renderiza dinámicamente según la configuración:

```astro
{config.listComponent === 'ListPost' && (
  <ListPost posts={posts} basePath={`${locale}/${routeSlug}`} />
)}

{config.listComponent === 'ListWork' && (
  <ListWork posts={posts} basePath={`${locale}/${routeSlug}`} lang={locale} />
)}
```

Si agregamos un nuevo componente, simplemente:

1. Agregamos el tipo en `SectionConfig`
2. Agregamos la rama en `SectionRenderer`

### 4. **`src/pages/[locale]/[section]/index.astro`** - Router Universal

Una única plantilla que maneja todas las rutas:

```astro
export async function getStaticPaths() {
  const paths = []
  for (const config of Object.values(sectionsConfig)) {
    for (const locale of languageKeys) {
      paths.push({
        params: {
          locale,
          section: config.routes[locale]  // ← Genera rutas dinámicamente
        }
      })
    }
  }
  return paths
}
```

Genera automáticamente:

- `/es/blog`, `/en/blog`
- `/es/charla`, `/en/talk`
- `/es/trabajo`, `/en/work`
- Etc.

## Beneficios

| Aspecto | Antes | Después |
| --- | --- | --- |
| **Duplicación** | ~100 líneas duplicadas | 0 líneas duplicadas |
| **Agregar sección** | Crear 2-3 archivos nuevos | Agregar entrada en `sections.ts` |
| **Cambiar alias** | Múltiples archivos | Un lugar |
| **Tests** | Por cada sección | Genéricos + configuración |
| **Complejidad** | `O(n)` por sección | `O(1)` constante |

## Patrón de Diseño: Strategy + Composition

```text
┌─────────────────────┐
│  sections.ts        │ ← Configuration (meta-data)
│  (SectionConfig)    │
└──────────┬──────────┘
           │
           ├─→ sectionLoader.ts (Strategy: how to load)
           │
           └─→ SectionRenderer.astro (Strategy: how to render)
                   ↓
                   ├─→ ListPost (Component A)
                   └─→ ListWork (Component B)
```

## Cómo Extender

### Agregar Nueva Sección

**Paso 1**: Agregar en `sections.ts`:

```typescript
export const sectionsConfig = {
  // ... secciones existentes

  newsletter: {
    collection: 'newsletter',
    translationKey: 'nav.newsletter',
    hasTags: false,
    routes: { es: 'boletin', en: 'newsletter' },
    listComponent: 'ListNewsletter',
    showFeaturedImage: false
  }
}
```

**Paso 2**: Eso es TODO.

Las rutas se generan automáticamente:
  /es/boletin
  /en/newsletter

Sin tocar:

- [section]/index.astro
- sectionLoader.ts
- SectionRenderer.astro

Este es el poder del polimorfismo ✨

## Patrones Implementados

```text
┌───────────────────────────────────────────────┐
│ Configuration Pattern                          │
│ (Toda la lógica guiada por datos)             │
└──────────────────┬────────────────────────────┘
                   │
    ┌──────────────┼──────────────┐
    │              │              │
    ▼              ▼              ▼
┌─────────┐ ┌──────────┐ ┌──────────────┐
│Strategy │ │Composite │ │Factory       │
│Pattern  │ │Pattern   │ │Pattern       │
├─────────┤ ├──────────┤ ├──────────────┤
│Polimor- │ │Basado en │ │Crea secciones│
│fismo    │ │compo-    │ │dinámicamente │
│según    │ │nentes    │ │desde config  │
│config   │ │existen-  │ │              │
│         │ │tes       │ │              │
└─────────┘ └──────────┘ └──────────────┘

    ▼              ▼              ▼
    │              │              │
    └──────────────┼──────────────┘
                   │
        ┌──────────┴────────────┐
        │                       │
        ▼                       ▼
┌──────────────┐      ┌──────────────┐
│ DRY          │      │ Type-Safe    │
│(No repeat)   │      │(TypeScript)  │
└──────────────┘      └──────────────┘
```

Este diagrama muestra cómo los patrones de diseño convergen en una arquitectura
limpia, mantenible y escalable. ✨
