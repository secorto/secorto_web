````markdown
# Diagrama de Arquitectura - Sistema Polimórfico de Secciones

## Flujo de Solicitud

```
┌─────────────────────────────────────────────────────────────────┐
│ Usuario accede a /es/charla                                     │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ [locale]/[section]/index.astro (Router Universal)               │
│  - Recibe params: locale='es', section='charla'                 │
│  - Llama a loadSectionByRoute('charla', 'es')                   │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ sectionLoader.ts (Strategy: Cómo cargar)                        │
│  - getSectionConfigByRoute('charla', 'es')                      │
│    └─→ Retorna config de 'talk'                                 │
│  - getPostsByLocale('talk', 'es')                               │
│    └─→ Retorna posts de la colección 'talk'                     │
│  - getUniqueTags(posts)                                         │
│    └─→ Retorna tags únicos                                      │
└────────────────────┬────────────────────────────────────────────┘
                     │
    ┌────────────────┴────────────────┐
    │                                 │
    ▼                                 ▼
┌──────────────────┐     ┌──────────────────────────┐
│ sections.ts      │     │ getPostsByLocale()       │
│ (Configuration)  │     │ (From paths.ts)          │
│                  │     │                          │
│ sectionsConfig   │     │ Filtra posts por:        │
│ {                │     │ - Colección              │
│   talk: {        │     │ - Idioma (es)            │
│     collection   │     │ - Ordena                 │
│     routes       │     │                          │
│     components   │     │ Retorna:                 │
│     ...          │     │ - posts[]                │
│   }              │     │ - tags[]                 │
│ }                │     └──────────────────────────┘
└──────────────────┘

    Resultado: {
      config: SectionConfig,
      posts: EntryWithCleanId[],
      tags: string[]
    }
```


```
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ [locale]/[section]/index.astro                                  │
│  - Verifica que sectionData != null                             │
│  - Pasa todo a <SectionRenderer>                                │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ SectionRenderer.astro (Strategy: Cómo renderizar)               │
                                                                  │
│ Renderiza dinámicamente según config.listComponent:            │
                                                                  │
│  if config.listComponent === 'ListPost'                         │
│    └─→ <ListPost posts={posts} />                              │
                                                                  │
│  if config.listComponent === 'ListWork'                         │
│    └─→ <ListWork posts={posts} lang={locale} />                │
                                                                  │
│  if config.hasTags                                              │
│    └─→ <Tags tags={tags} />                                    │
                                                                  │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ HTML Renderizado: /es/charla                                    │
│                                                                  │
│ ┌─────────────────────────────────────────┐                     │
│ │ Header                                  │                     │
│ │ Charlas                                 │                     │
│ └─────────────────────────────────────────┘                     │
│ ┌─────────────────────────────────────────┐                     │
│ │ Tags: [JavaScript, Python, ...]         │                     │
│ └─────────────────────────────────────────┘                     │
│ ┌─────────────────────────────────────────┐                     │
│ │ ListPost:                               │                     │
│ │  - Charla 1: "Intro a TypeScript"       │                     │
│ │  - Charla 2: "Testing en TypeScript"    │                     │
│ │  - ...                                  │                     │
│ └─────────────────────────────────────────┘                     │
│ ┌─────────────────────────────────────────┐                     │
│ │ Footer                                  │                     │
│ └─────────────────────────────────────────┘                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Comparación: Antes vs Después

### ANTES: Múltiples Archivos con Duplicación

```
src/pages/[locale]/
├── blog/
│   ├── index.astro               ← 23 líneas
│   │   - import getPostsByLocale
│   │   - import getUniqueTags
│   │   - collection = 'blog'
│   │   - route = 'blog'
│   │   - listComponent = ListPost
│   │
│   └── [id].astro                ← Duplicación en routing
│       └── getStaticPaths()       ← Duplicación en lógica
│
├── charla/
│   ├── index.astro               ← 23 líneas (95% igual)
│   │   - import getPostsByLocale
│   │   - import getUniqueTags
│   │   - collection = 'talk'  ← Único cambio
│   │   - route = 'charla'     ← Único cambio
│   │   - listComponent = ListPost
│   │
│   └── [id].astro                ← Duplicación en routing
│       └── getStaticPaths()       ← Duplicación en lógica
│
└── trabajo/
    ├── index.astro               ← 23 líneas
    │   - import getPostsByLocale
    │   - import ListWork         ← Único cambio
    │   - collection = 'work'  ← Único cambio
    │   - route = 'trabajo'    ← Único cambio
    │   - listComponent = ListWork ← Único cambio
    │
    └── [id].astro                ← Duplicación en routing
        └── getStaticPaths()       ← Duplicación en lógica

Total: 3 secciones × 2 archivos = 6 archivos
       Cada cambio requiere tocar múltiples lugares
```

### DESPUÉS: Arquitectura Centralizada

```
src/
├── config/
│   └── sections.ts               ← 63 líneas
│       {
        blog: { collection, routes, listComponent, ... },
        talk: { collection, routes, listComponent, ... },
        work: { collection, routes, listComponent, ... },
        project: { ... },
        community: { ... }
       }
│
├── utils/
│   └── sectionLoader.ts          ← 42 líneas
│       - loadSectionByRoute()      (Carga basada en URL)
│       - getSectionConfigByRoute() (Lookup)
│
├── components/
│   └── SectionRenderer.astro     ← 28 líneas
│       - Renderiza dinámicamente según config
│       - Polimorfismo: ListPost vs ListWork
│       - Tags condicionales
│
└── pages/[locale]/
    └── [section]/
        └── index.astro           ← 47 líneas (UNA SOLA!)
            - Genera rutas para TODAS las secciones
            - Maneja secciones + items + tags

Total: 1 sección × 1 archivo = 1 archivo
       Cambios centralizados en sections.ts
```

## Generación Automática de Rutas

```typescript
export async function getStaticPaths() {
  const paths = []

  // Itera sobre sectionsConfig
  for (const [type, config] of Object.entries(sectionsConfig)) {
    for (const locale of ['es', 'en']) {
      const route = config.routes[locale]
      paths.push({
        params: { locale, section: route }
      })
    }
  }

  return paths
}

// Resultado generado automáticamente:
[
  { params: { locale: 'es', section: 'blog' } },      // /es/blog
  { params: { locale: 'en', section: 'blog' } },      // /en/blog
  { params: { locale: 'es', section: 'charla' } },    // /es/charla ← Alias!
  { params: { locale: 'en', section: 'talk' } },      // /en/talk
  { params: { locale: 'es', section: 'trabajo' } },   // /es/trabajo
  { params: { locale: 'en', section: 'work' } },      // /en/work
  { params: { locale: 'es', section: 'proyecto' } },  // /es/proyecto
  { params: { locale: 'en', section: 'project' } },   // /en/project
  { params: { locale: 'es', section: 'comunidad' } }, // /es/comunidad
  { params: { locale: 'en', section: 'community' } }, // /en/community
]

// 5 secciones × 2 idiomas = 10 rutas generadas
// CERO cambios en código de routing
```

## Flujo de Datos

```
Entrada:
  URL: /es/charla
  Params: { locale: 'es', section: 'charla' }

↓

sections.ts lookup:
  getSectionConfigByRoute('charla', 'es')
  ↓
  for (section of sectionsConfig) {
    if (section.routes['es'] === 'charla') ✓
      return section  // → config de 'talk'
  }

↓

Configuración obtenida:
  {
    collection: 'talk',
    translationKey: 'nav.talks',
    hasTags: true,
    routes: { es: 'charla', en: 'talk' },
    listComponent: 'ListPost',
    showFeaturedImage: true
  }

↓

Carga de datos:
  posts = getPostsByLocale('talk', 'es')  // Del content layer
  tags = getUniqueTags(posts)              // Si hasTags = true

↓

Renderizado dinámico:
  SectionRenderer se decide:
    - ¿Qué componente? → config.listComponent = 'ListPost'
    - ¿Mostrar tags? → config.hasTags = true
    - ¿Imagen destacada? → config.showFeaturedImage = true

↓

Resultado:
  <BaseLayout>
    <Tags />
    <ListPost />
  </BaseLayout>

↓

HTML final: /es/charla con contenido de 'talk' collection
```

## Beneficio: Extensibilidad

```
Para agregar nueva sección "Newsletter":

  1. En sections.ts:
     newsletter: {
       collection: 'newsletter',
       routes: { es: 'boletin', en: 'newsletter' },
       listComponent: 'ListNewsletter',
       ...
     }

  2. Eso es TODO.

  Las rutas se generan automáticamente:
    /es/boletin
    /en/newsletter

  Sin tocar:
    - [section]/index.astro
    - sectionLoader.ts
    - SectionRenderer.astro

  Este es el poder del polimorfismo ✨
```

## Patrones Implementados

```
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

Este diagrama muestra cómo los patrones de diseño convergen en una arquitectura
limpia, mantenible y escalable. ✨

````
